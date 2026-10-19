import { useCallback, useEffect, useRef, useState } from 'react';
import { isAbortError } from '@/api';
import { useLatest } from './useLatest';

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

interface AsyncState<T> {
  status: AsyncStatus;
  data: T | undefined;
  error: Error | undefined;
}

const IDLE: AsyncState<never> = { status: 'idle', data: undefined, error: undefined };

const toError = (value: unknown) => (value instanceof Error ? value : new Error(String(value)));

/**
 * Runs an abortable async task and tracks its lifecycle.
 * - Starting a new run aborts the previous one (no out-of-order responses).
 * - Unmounting aborts the in-flight run (no state updates after unmount).
 * - `run` is referentially stable, so it's safe in effect/callback deps.
 */
export function useAsyncTask<TArgs extends unknown[], TResult>(
  task: (signal: AbortSignal, ...args: TArgs) => Promise<TResult>,
) {
  const [state, setState] = useState<AsyncState<TResult>>(IDLE);
  const controllerRef = useRef<AbortController | null>(null);
  const taskRef = useLatest(task);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setState({ status: 'pending', data: undefined, error: undefined });
      try {
        const data = await taskRef.current(controller.signal, ...args);
        if (!controller.signal.aborted) setState({ status: 'success', data, error: undefined });
        return data;
      } catch (error) {
        if (!controller.signal.aborted && !isAbortError(error)) {
          setState({ status: 'error', data: undefined, error: toError(error) });
        }
        return undefined;
      }
    },
    [taskRef],
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setState(IDLE);
  }, []);

  return { ...state, run, reset };
}
