import { useMemo } from 'react';
import type { AsyncStatus } from '@/hooks/useAsyncTask';
import type { useJourneyNavigation } from '../hooks';
import { selectAnswerSummary, selectCurrentPage, useJourneyState } from '../state';
import { QuestionPage } from './QuestionPage';
import { QuoteResult } from './QuoteResult/QuoteResult';
import { ErrorState } from './Status/ErrorState';
import { LoadingState } from './Status/LoadingState';

interface JourneyContentProps {
  loadStatus: AsyncStatus;
  onRetryLoad: () => void;
  navigation: ReturnType<typeof useJourneyNavigation>;
}

/** Chooses what the main panel shows: loading, error, a question page or the quote. */
export function JourneyContent({ loadStatus, onRetryLoad, navigation }: JourneyContentProps) {
  const state = useJourneyState();
  const currentPage = selectCurrentPage(state);
  const summary = useMemo(() => selectAnswerSummary(state), [state]);

  if (loadStatus === 'error') {
    return (
      <ErrorState
        title="We couldn't load your application"
        message="Please check your connection and try again."
        onRetry={onRetryLoad}
      />
    );
  }

  if (loadStatus !== 'success') {
    return <LoadingState message="Loading your application…" />;
  }

  if (state.stage === 'quote' && state.quote) {
    return (
      <QuoteResult
        quote={state.quote}
        summary={summary}
        onBack={navigation.goBack}
        onEdit={navigation.goToPage}
        onRestart={navigation.restart}
      />
    );
  }

  if (!currentPage) return null;

  return (
    <QuestionPage
      key={currentPage.id}
      page={currentPage}
      answers={state.answers}
      isFirstPage={navigation.isFirstPage}
      isLastPage={navigation.isLastPage}
      isSubmitting={navigation.isSubmitting}
      submitError={navigation.submitError}
      onNext={navigation.goNext}
      onBack={navigation.goBack}
    />
  );
}
