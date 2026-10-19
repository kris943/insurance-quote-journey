import type { QuoteRequest } from '@/api';
import { formatAnswer, getQuestionDefinition, validateQuestions } from '../questions';
import { JOURNEY_STEPS } from './steps';
import type { JourneyPage, JourneyState, StepId } from './types';

export type NavStatus = 'complete' | 'current' | 'upcoming';

export interface PageNavItem {
  id: string;
  title: string;
  index: number;
  status: NavStatus;
  isNavigable: boolean;
}

export interface StepNavItem {
  id: StepId;
  number: number;
  label: string;
  status: NavStatus;
  isNavigable: boolean;
  hasSubPages: boolean;
  /** Page to open when the step itself is selected. */
  targetIndex: number | null;
  pages: PageNavItem[];
}

export const selectCurrentPage = (state: JourneyState): JourneyPage | null =>
  state.stage === 'questions' ? (state.pages[state.currentIndex] ?? null) : null;

export const selectIsFirstPage = (state: JourneyState) =>
  state.stage === 'questions' && state.currentIndex === 0;

export const selectIsLastPage = (state: JourneyState) =>
  state.currentIndex === state.pages.length - 1;

export const selectIsCurrentPageValid = (state: JourneyState): boolean => {
  const page = state.pages[state.currentIndex];
  return !page || Object.keys(validateQuestions(page.questions, state.answers)).length === 0;
};

const isPageComplete = (state: JourneyState, page: JourneyPage) =>
  state.completedPageIds.includes(page.id);

/**
 * Backwards navigation is always allowed. Moving forward requires every page
 * in between to be complete and the current page to still be valid.
 */
export function canNavigateToPage(state: JourneyState, index: number): boolean {
  const target = state.pages[index];
  if (!target) return false;
  if (state.stage === 'questions' && index === state.currentIndex) return false;

  const reachable = state.pages.slice(0, index).every((page) => isPageComplete(state, page));
  if (!reachable) return false;

  return state.stage === 'quote' || index < state.currentIndex || selectIsCurrentPageValid(state);
}

const pageStatus = (state: JourneyState, page: JourneyPage, index: number): NavStatus => {
  if (state.stage === 'questions' && index === state.currentIndex) return 'current';
  return isPageComplete(state, page) ? 'complete' : 'upcoming';
};

export function selectStepNav(state: JourneyState): StepNavItem[] {
  return JOURNEY_STEPS.map((step, stepIndex) => {
    const base = { id: step.id, number: stepIndex + 1, label: step.label };

    if (step.id === 'quote') {
      const hasQuote = state.quote !== null;
      return {
        ...base,
        status: state.stage === 'quote' ? 'current' : 'upcoming',
        isNavigable: hasQuote && state.stage !== 'quote',
        hasSubPages: false,
        targetIndex: null,
        pages: [],
      };
    }

    const pages: PageNavItem[] = state.pages.flatMap((page, index) =>
      page.stepId === step.id
        ? [
            {
              id: page.id,
              title: page.title,
              index,
              status: pageStatus(state, page, index),
              isNavigable: canNavigateToPage(state, index),
            },
          ]
        : [],
    );

    const status: NavStatus = pages.some((p) => p.status === 'current')
      ? 'current'
      : pages.length > 0 && pages.every((p) => p.status === 'complete')
        ? 'complete'
        : 'upcoming';

    const firstPage = pages[0];
    return {
      ...base,
      status,
      isNavigable: firstPage?.isNavigable ?? false,
      hasSubPages: step.hasSubPages && pages.length > 0,
      targetIndex: firstPage?.index ?? null,
      pages,
    };
  });
}

const askedQuestionIds = (state: JourneyState) => state.pages.flatMap((page) => page.questions);

/** Only answers for questions currently in the journey are sent — stale answers stay local. */
export function selectQuotePayload(state: JourneyState): QuoteRequest {
  const answers: QuoteRequest['answers'] = {};
  for (const id of askedQuestionIds(state)) {
    const raw = state.answers[id];
    if (raw === undefined) continue;
    const { serialize } = getQuestionDefinition(id);
    answers[id] = serialize ? serialize(raw) : raw;
  }
  return { answers };
}

export interface AnswerSummarySection {
  pageId: string;
  pageIndex: number;
  title: string;
  items: { id: string; label: string; value: string }[];
}

export const selectAnswerSummary = (state: JourneyState): AnswerSummarySection[] =>
  state.pages.map((page, pageIndex) => ({
    pageId: page.id,
    pageIndex,
    title: page.title,
    items: page.questions.map((id) => ({
      id,
      label: getQuestionDefinition(id).label,
      value: formatAnswer(id, state.answers[id] ?? ''),
    })),
  }));
