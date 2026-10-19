import { useEffect, type RefObject } from 'react';

/** Moves focus to an element when it mounts — used to announce page changes to assistive tech. */
export function useFocusOnMount<T extends HTMLElement>(ref: RefObject<T | null>, enabled = true) {
  useEffect(() => {
    if (enabled) ref.current?.focus({ preventScroll: false });
  }, [ref, enabled]);
}
