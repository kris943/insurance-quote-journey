import { useReducer, type ReactNode } from 'react';
import { JourneyDispatchContext, JourneyStateContext } from './context';
import { initialJourneyState, journeyReducer } from './reducer';
import type { JourneyState } from './types';

interface JourneyProviderProps {
  children: ReactNode;
  /** Allows tests to start from an arbitrary point in the journey. */
  initialState?: JourneyState;
}

export function JourneyProvider({
  children,
  initialState = initialJourneyState,
}: JourneyProviderProps) {
  const [state, dispatch] = useReducer(journeyReducer, initialState);
  return (
    <JourneyStateContext.Provider value={state}>
      <JourneyDispatchContext.Provider value={dispatch}>{children}</JourneyDispatchContext.Provider>
    </JourneyStateContext.Provider>
  );
}
