import { createContext, useContext, type Context, type Dispatch } from 'react';
import type { JourneyAction } from './actions';
import type { JourneyState } from './types';

/*
 * State and dispatch live in separate contexts: components that only dispatch
 * (or receive stable callbacks) don't re-render on every state change.
 */
export const JourneyStateContext = createContext<JourneyState | null>(null);
export const JourneyDispatchContext = createContext<Dispatch<JourneyAction> | null>(null);

function useRequiredContext<T>(context: Context<T | null>, hookName: string): T {
  const value = useContext(context);
  if (value === null) throw new Error(`${hookName} must be used within a <JourneyProvider>`);
  return value;
}

export const useJourneyState = () => useRequiredContext(JourneyStateContext, 'useJourneyState');
export const useJourneyDispatch = () =>
  useRequiredContext(JourneyDispatchContext, 'useJourneyDispatch');
