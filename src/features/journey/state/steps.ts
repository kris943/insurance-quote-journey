import type { JourneyPage, StepId } from './types';

export interface StepConfig {
  id: StepId;
  label: string;
  /** Steps that contain multiple pages render them as a nested list. */
  hasSubPages: boolean;
}

export const JOURNEY_STEPS: readonly StepConfig[] = [
  { id: 'details', label: 'Your Details', hasSubPages: false },
  { id: 'application', label: 'Application', hasSubPages: true },
  { id: 'quote', label: 'Quote', hasSubPages: false },
];

/**
 * The "Your Details" step is owned by the frontend. Its questions are removed
 * from server-driven pages so the customer is never asked the same thing twice.
 */
export const YOUR_DETAILS_PAGE: JourneyPage = {
  id: 'static-0-your-details',
  title: 'Your Details',
  stepId: 'details',
  source: 'static',
  questions: ['email', 'phone'],
};
