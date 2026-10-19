import {
  initialJourneyState,
  journeyActions as a,
  journeyReducer,
  selectQuotePayload,
  selectStepNav,
} from '../state';

const state = [
  a.applicationLoaded([
    { title: 'About You', questions: ['email', 'phone', 'occupation'] },
    { title: 'Lifestyle', questions: ['smokedLast12Months'] },
  ]),
  a.answerChanged('email', '  name@example.com '),
  a.answerChanged('phone', '0400 000 000'),
  a.answerChanged('occupation', 'education'),
  a.answerChanged('smokedLast12Months', 'yes'),
  a.answerChanged('notAsked', 'stale'),
  a.nextPage(),
].reduce(journeyReducer, initialJourneyState);

describe('selectQuotePayload', () => {
  it('serialises answers into API types and omits questions not in the journey', () => {
    expect(selectQuotePayload(state)).toEqual({
      answers: {
        email: 'name@example.com',
        phone: '0400000000',
        occupation: 'education',
        smokedLast12Months: true,
      },
    });
  });
});

describe('selectStepNav', () => {
  it('reports step and page status for the sidebar', () => {
    const [details, application, quote] = selectStepNav(state);

    expect(details).toMatchObject({ status: 'complete', isNavigable: true });
    expect(application).toMatchObject({ status: 'current', hasSubPages: true });
    expect(application?.pages.map((p) => [p.title, p.status, p.isNavigable])).toEqual([
      ['About You', 'current', false],
      ['Lifestyle', 'upcoming', false],
    ]);
    expect(quote).toMatchObject({ status: 'upcoming', isNavigable: false });
  });
});
