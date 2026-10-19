import type { ApiPage, ApplicationResponse, Quote, QuoteResponse } from './types';

/**
 * Lightweight runtime guards so a malformed response fails loudly at the
 * network boundary instead of deep inside the UI.
 */
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isApiPage = (value: unknown): value is ApiPage =>
  isObject(value) &&
  typeof value.title === 'string' &&
  Array.isArray(value.questions) &&
  value.questions.every((q) => typeof q === 'string');

const isPageList = (value: unknown): value is ApiPage[] =>
  Array.isArray(value) && value.every(isApiPage);

const isQuote = (value: unknown): value is Quote =>
  isObject(value) &&
  typeof value.product === 'string' &&
  typeof value.coverAmount === 'number' &&
  typeof value.premium === 'number';

export const isApplicationResponse = (value: unknown): value is ApplicationResponse =>
  isObject(value) && isPageList(value.pages);

export const isQuoteResponse = (value: unknown): value is QuoteResponse => {
  if (!isObject(value)) return false;
  if (value.status === 'quoted') return isQuote(value.quote);
  if (value.status === 'additionalQuestionsRequired') return isPageList(value.pages);
  return false;
};
