import { useCallback } from 'react';
import { insuranceApi, type QuoteRequest } from '@/api';
import { useAsyncTask } from '@/hooks/useAsyncTask';
import {
  hasUnaskedQuestions,
  journeyActions,
  useJourneyDispatch,
  type JourneyPage,
} from '../state';

export const REPEATED_QUESTIONS_ERROR =
  "We couldn't finish your quote right now. Please try again or contact us.";

/**
 * Submits answers to POST /quote. The API either returns a quote or more
 * questions; follow-up pages are appended to the journey and the customer
 * submits again until a quote is returned.
 */
export function useQuoteSubmission() {
  const dispatch = useJourneyDispatch();

  const { status, error, run, reset } = useAsyncTask(
    async (signal: AbortSignal, payload: QuoteRequest, askedPages: JourneyPage[]) => {
      const response = await insuranceApi.requestQuote(payload, signal);
      if (signal.aborted) return;

      if (response.status === 'quoted') {
        dispatch(journeyActions.quoteReceived(response.quote));
        return;
      }

      // Guard against the API re-requesting questions we've already answered,
      // which would otherwise trap the customer in an endless loop.
      if (!hasUnaskedQuestions(response.pages, askedPages)) {
        throw new Error(REPEATED_QUESTIONS_ERROR);
      }
      dispatch(journeyActions.additionalPagesReceived(response.pages));
    },
  );

  const submit = useCallback(
    (payload: QuoteRequest, askedPages: JourneyPage[]) => run(payload, askedPages),
    [run],
  );

  return { submit, reset, isSubmitting: status === 'pending', error };
}
