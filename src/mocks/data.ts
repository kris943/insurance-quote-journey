import type { ApplicationResponse } from '@/api';

export const applicationFixture: ApplicationResponse = {
  pages: [
    { title: 'About You', questions: ['email', 'phone', 'occupation'] },
    { title: 'Lifestyle', questions: ['smokedLast12Months'] },
  ],
};

/** Any email using this address makes the mock quote API fail — handy for demoing error states. */
export const FAILURE_EMAIL = 'fail@example.com';
