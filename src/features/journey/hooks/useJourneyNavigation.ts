import { useCallback, useMemo } from 'react';
import { useLatest } from '@/hooks/useLatest';
import {
  canNavigateToPage,
  journeyActions,
  selectIsFirstPage,
  selectIsLastPage,
  selectQuotePayload,
  useJourneyDispatch,
  useJourneyState,
} from '../state';
import { useQuoteSubmission } from './useQuoteSubmission';

/**
 * Orchestrates movement through the journey. All returned callbacks are
 * stable (they read the latest state via a ref), so memoised children
 * receiving them don't re-render on unrelated state changes.
 */
export function useJourneyNavigation() {
  const state = useJourneyState();
  const dispatch = useJourneyDispatch();
  const quote = useQuoteSubmission();
  const stateRef = useLatest(state);
  const { submit, reset: resetSubmission } = quote;

  const goNext = useCallback(() => {
    const current = stateRef.current;
    if (!selectIsLastPage(current)) {
      dispatch(journeyActions.nextPage());
    } else if (current.quote) {
      // Nothing changed since the last quote — no need to hit the API again.
      dispatch(journeyActions.quoteSelected());
    } else {
      void submit(selectQuotePayload(current), current.pages);
    }
  }, [dispatch, stateRef, submit]);

  const goBack = useCallback(() => {
    resetSubmission();
    dispatch(journeyActions.previousPage());
  }, [dispatch, resetSubmission]);

  const goToPage = useCallback(
    (index: number) => {
      if (!canNavigateToPage(stateRef.current, index)) return;
      resetSubmission();
      dispatch(journeyActions.pageSelected(index));
    },
    [dispatch, resetSubmission, stateRef],
  );

  const goToQuote = useCallback(() => dispatch(journeyActions.quoteSelected()), [dispatch]);

  const restart = useCallback(() => {
    resetSubmission();
    dispatch(journeyActions.journeyRestarted());
  }, [dispatch, resetSubmission]);

  const isFirstPage = selectIsFirstPage(state);
  const isLastPage = selectIsLastPage(state);

  return useMemo(
    () => ({
      goNext,
      goBack,
      goToPage,
      goToQuote,
      restart,
      isFirstPage,
      isLastPage,
      isSubmitting: quote.isSubmitting,
      submitError: quote.error,
    }),
    [
      goNext,
      goBack,
      goToPage,
      goToQuote,
      restart,
      isFirstPage,
      isLastPage,
      quote.isSubmitting,
      quote.error,
    ],
  );
}
