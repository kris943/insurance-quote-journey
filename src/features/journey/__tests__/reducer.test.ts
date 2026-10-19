import type { ApiPage } from '@/api';
import {
  initialJourneyState,
  journeyActions as a,
  journeyReducer,
  type JourneyState,
} from '../state';

const APPLICATION_PAGES: ApiPage[] = [
  { title: 'About You', questions: ['email', 'phone', 'occupation'] },
  { title: 'Lifestyle', questions: ['smokedLast12Months'] },
];
const SMOKING_PAGES: ApiPage[] = [{ title: 'Smoking Details', questions: ['cigarettesPerWeek'] }];

const reduce = (state: JourneyState, ...actions: ReturnType<(typeof a)[keyof typeof a]>[]) =>
  actions.reduce(journeyReducer, state);

const loaded = () => reduce(initialJourneyState, a.applicationLoaded(APPLICATION_PAGES));

describe('journeyReducer', () => {
  it('removes questions already asked in "Your Details" from server pages', () => {
    const state = loaded();
    expect(state.pages.map((p) => [p.title, p.questions])).toEqual([
      ['Your Details', ['email', 'phone']],
      ['About You', ['occupation']],
      ['Lifestyle', ['smokedLast12Months']],
    ]);
  });

  it('drops pages left empty after de-duplication', () => {
    const state = reduce(
      initialJourneyState,
      a.applicationLoaded([{ title: 'Contact', questions: ['email'] }, ...APPLICATION_PAGES]),
    );
    expect(state.pages.map((p) => p.title)).toEqual(['Your Details', 'About You', 'Lifestyle']);
  });

  it('marks pages complete as the customer progresses', () => {
    const state = reduce(loaded(), a.nextPage(), a.nextPage());
    expect(state.currentIndex).toBe(2);
    expect(state.completedPageIds).toHaveLength(2);
  });

  it('does not advance past the last page', () => {
    const state = reduce(loaded(), a.nextPage(), a.nextPage(), a.nextPage());
    expect(state.currentIndex).toBe(2);
  });

  it('appends additional pages and moves to the first new one', () => {
    const state = reduce(
      loaded(),
      a.nextPage(),
      a.nextPage(),
      a.additionalPagesReceived(SMOKING_PAGES),
    );
    expect(state.pages.at(-1)).toMatchObject({ title: 'Smoking Details', source: 'quote' });
    expect(state.currentIndex).toBe(3);
    expect(state.completedPageIds).toHaveLength(3);
  });

  it('blocks jumping ahead to pages that are not yet reachable', () => {
    const state = reduce(loaded(), a.pageSelected(2));
    expect(state.currentIndex).toBe(0);
  });

  it('invalidates follow-up pages and the quote when an earlier answer changes', () => {
    const quoted = reduce(
      loaded(),
      a.answerChanged('smokedLast12Months', 'yes'),
      a.nextPage(),
      a.nextPage(),
      a.additionalPagesReceived(SMOKING_PAGES),
      a.answerChanged('cigarettesPerWeek', '10'),
      a.quoteReceived({ product: 'Life Protect', coverAmount: 500000, premium: 99 }),
      a.pageSelected(2),
    );
    expect(quoted.quote).not.toBeNull();

    const edited = journeyReducer(quoted, a.answerChanged('smokedLast12Months', 'no'));
    expect(edited.pages.map((p) => p.title)).not.toContain('Smoking Details');
    expect(edited.quote).toBeNull();
    // The answer is retained so it is pre-filled if the question is asked again.
    expect(edited.answers.cigarettesPerWeek).toBe('10');
  });

  it('ignores answer changes that do not change the value', () => {
    const state = reduce(loaded(), a.answerChanged('email', 'a@b.com'));
    expect(journeyReducer(state, a.answerChanged('email', 'a@b.com'))).toBe(state);
  });

  it('restarts with fresh answers while keeping the loaded application pages', () => {
    const state = reduce(
      loaded(),
      a.answerChanged('email', 'a@b.com'),
      a.nextPage(),
      a.additionalPagesReceived(SMOKING_PAGES),
      a.journeyRestarted(),
    );
    expect(state.answers).toEqual({});
    expect(state.currentIndex).toBe(0);
    expect(state.pages).toHaveLength(3);
  });
});
