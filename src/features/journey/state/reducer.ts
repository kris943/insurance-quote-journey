import type { JourneyAction } from './actions';
import { createJourneyPages } from './pageFactory';
import { YOUR_DETAILS_PAGE } from './steps';
import type { JourneyState } from './types';

export const initialJourneyState: JourneyState = {
  pages: [YOUR_DETAILS_PAGE],
  currentIndex: 0,
  stage: 'questions',
  answers: {},
  completedPageIds: [],
  quote: null,
};

const clampIndex = (index: number, state: JourneyState) =>
  Math.min(Math.max(index, 0), state.pages.length - 1);

const markCurrentComplete = (state: JourneyState): string[] => {
  const page = state.pages[state.currentIndex];
  if (!page || state.completedPageIds.includes(page.id)) return state.completedPageIds;
  return [...state.completedPageIds, page.id];
};

/** All pages before `index` must be complete before it can be visited. */
const isReachable = (state: JourneyState, index: number) =>
  state.pages.slice(0, index).every((page) => state.completedPageIds.includes(page.id));

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case 'applicationLoaded': {
      const base = state.pages.filter((page) => page.source === 'static');
      return {
        ...state,
        pages: [...base, ...createJourneyPages(action.pages, base, 'application', 'application')],
      };
    }

    case 'answerChanged': {
      const { questionId, value } = action;
      if (state.answers[questionId] === value) return state;

      const answers = { ...state.answers, [questionId]: value };
      const ownerPage = state.pages.find((page) => page.questions.includes(questionId));

      // Follow-up questions and the quote depend on earlier answers, so they
      // become stale. Answers are kept so a re-asked question stays pre-filled.
      if (ownerPage && ownerPage.source !== 'quote') {
        const pages = state.pages.filter((page) => page.source !== 'quote');
        const pageIds = new Set(pages.map((page) => page.id));
        return {
          ...state,
          answers,
          pages,
          completedPageIds: state.completedPageIds.filter((id) => pageIds.has(id)),
          currentIndex: Math.min(state.currentIndex, pages.length - 1),
          quote: null,
        };
      }
      return { ...state, answers, quote: null };
    }

    case 'nextPage': {
      if (state.currentIndex >= state.pages.length - 1) return state;
      return {
        ...state,
        completedPageIds: markCurrentComplete(state),
        currentIndex: state.currentIndex + 1,
      };
    }

    case 'previousPage': {
      if (state.stage === 'quote') return { ...state, stage: 'questions' };
      return { ...state, currentIndex: clampIndex(state.currentIndex - 1, state) };
    }

    case 'pageSelected': {
      const index = clampIndex(action.index, state);
      if (!isReachable(state, index)) return state;
      return { ...state, stage: 'questions', currentIndex: index };
    }

    case 'additionalPagesReceived': {
      const newPages = createJourneyPages(action.pages, state.pages, 'application', 'quote');
      if (newPages.length === 0) return state;
      return {
        ...state,
        completedPageIds: markCurrentComplete(state),
        pages: [...state.pages, ...newPages],
        currentIndex: state.pages.length,
      };
    }

    case 'quoteReceived':
      return {
        ...state,
        completedPageIds: markCurrentComplete(state),
        quote: action.quote,
        stage: 'quote',
      };

    case 'quoteSelected':
      return state.quote ? { ...state, stage: 'quote' } : state;

    case 'journeyRestarted':
      return {
        ...initialJourneyState,
        pages: state.pages.filter((page) => page.source !== 'quote'),
      };

    default:
      return state;
  }
}
