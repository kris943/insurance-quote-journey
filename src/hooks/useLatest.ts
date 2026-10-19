import { useLayoutEffect, useRef } from 'react';

/**
 * Keeps a ref pointing at the latest value so stable callbacks can read fresh
 * props/state without being re-created (and without stale closures).
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
