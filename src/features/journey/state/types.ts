import type { QuestionId, Quote } from '@/api';

export type StepId = 'details' | 'application' | 'quote';
export type QuestionStepId = Exclude<StepId, 'quote'>;

/** Where a page originated — drives invalidation when earlier answers change. */
export type PageSource = 'static' | 'application' | 'quote';

export interface JourneyPage {
  id: string;
  title: string;
  stepId: QuestionStepId;
  source: PageSource;
  questions: QuestionId[];
}

/** Raw form values keyed by question id; serialized only when calling the API. */
export type Answers = Record<QuestionId, string>;

export type JourneyStage = 'questions' | 'quote';

export interface JourneyState {
  pages: JourneyPage[];
  currentIndex: number;
  stage: JourneyStage;
  answers: Answers;
  completedPageIds: string[];
  quote: Quote | null;
}
