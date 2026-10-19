import { delay, http, HttpResponse } from 'msw';
import type { QuoteRequest } from '@/api';
import { applicationFixture, FAILURE_EMAIL } from './data';
import { evaluateQuote } from './quoteEngine';

/** Simulated network latency so loading states are visible in the browser. */
const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 600;

export const handlers = [
  http.get('*/application', async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(applicationFixture);
  }),

  http.post('*/quote', async ({ request }) => {
    await delay(LATENCY_MS);
    const body = (await request.json()) as QuoteRequest;

    if (body.answers.email === FAILURE_EMAIL) {
      return HttpResponse.json(
        { message: 'Our quoting service is temporarily unavailable. Please try again.' },
        { status: 503 },
      );
    }

    const result = evaluateQuote(body);
    return result.ok
      ? HttpResponse.json(result.response)
      : HttpResponse.json({ message: result.message }, { status: result.status });
  }),
];
