import { useMemo } from 'react';
import { JourneyContent } from './components/JourneyContent';
import { JourneyLayout } from './components/JourneyLayout';
import { StepNav } from './components/StepNav/StepNav';
import { useApplicationLoader, useJourneyNavigation } from './hooks';
import { selectStepNav, useJourneyState } from './state';

/** Feature entry point: wires data loading and navigation into the layout. */
export function Journey() {
  const state = useJourneyState();
  const { status, retry } = useApplicationLoader();
  const navigation = useJourneyNavigation();
  const steps = useMemo(() => selectStepNav(state), [state]);

  return (
    <JourneyLayout
      sidebar={
        <StepNav
          steps={steps}
          onSelectPage={navigation.goToPage}
          onSelectQuote={navigation.goToQuote}
        />
      }
    >
      <JourneyContent loadStatus={status} onRetryLoad={retry} navigation={navigation} />
    </JourneyLayout>
  );
}
