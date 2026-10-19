import { useEffect } from 'react';
import { insuranceApi } from '@/api';
import { useAsyncTask } from '@/hooks/useAsyncTask';
import { journeyActions, useJourneyDispatch } from '../state';

/** Fetches the server-driven application pages once on mount, with retry support. */
export function useApplicationLoader() {
  const dispatch = useJourneyDispatch();

  const { status, error, run } = useAsyncTask(async (signal: AbortSignal) => {
    const { pages } = await insuranceApi.getApplication(signal);
    if (!signal.aborted) dispatch(journeyActions.applicationLoaded(pages));
  });

  useEffect(() => {
    void run();
  }, [run]);

  return { status, error, retry: run };
}
