import type { ApiPage, QuestionId, Quote } from '@/api';

export type JourneyAction =
  | { type: 'applicationLoaded'; pages: ApiPage[] }
  | { type: 'answerChanged'; questionId: QuestionId; value: string }
  | { type: 'nextPage' }
  | { type: 'previousPage' }
  | { type: 'pageSelected'; index: number }
  | { type: 'additionalPagesReceived'; pages: ApiPage[] }
  | { type: 'quoteReceived'; quote: Quote }
  | { type: 'quoteSelected' }
  | { type: 'journeyRestarted' };

export const journeyActions = {
  applicationLoaded: (pages: ApiPage[]): JourneyAction => ({ type: 'applicationLoaded', pages }),
  answerChanged: (questionId: QuestionId, value: string): JourneyAction => ({
    type: 'answerChanged',
    questionId,
    value,
  }),
  nextPage: (): JourneyAction => ({ type: 'nextPage' }),
  previousPage: (): JourneyAction => ({ type: 'previousPage' }),
  pageSelected: (index: number): JourneyAction => ({ type: 'pageSelected', index }),
  additionalPagesReceived: (pages: ApiPage[]): JourneyAction => ({
    type: 'additionalPagesReceived',
    pages,
  }),
  quoteReceived: (quote: Quote): JourneyAction => ({ type: 'quoteReceived', quote }),
  quoteSelected: (): JourneyAction => ({ type: 'quoteSelected' }),
  journeyRestarted: (): JourneyAction => ({ type: 'journeyRestarted' }),
};
