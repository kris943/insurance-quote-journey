import { isApplicationResponse, isQuoteResponse } from './guards';
import { request } from './httpClient';
import type { ApplicationResponse, QuoteRequest, QuoteResponse } from './types';

export const insuranceApi = {
  getApplication: (signal?: AbortSignal): Promise<ApplicationResponse> =>
    request('/application', { signal, validate: isApplicationResponse }),

  requestQuote: (payload: QuoteRequest, signal?: AbortSignal): Promise<QuoteResponse> =>
    request('/quote', { method: 'POST', body: payload, signal, validate: isQuoteResponse }),
};
