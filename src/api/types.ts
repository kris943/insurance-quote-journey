/**
 * Wire contract for the insurance API.
 * The API only references questions by id — rendering metadata lives in the
 * frontend question registry (see `features/journey/questions`).
 */
export type QuestionId = string;

export interface ApiPage {
  title: string;
  questions: QuestionId[];
}

export interface ApplicationResponse {
  pages: ApiPage[];
}

export interface Quote {
  product: string;
  coverAmount: number;
  premium: number;
}

export type QuoteResponse =
  { status: 'additionalQuestionsRequired'; pages: ApiPage[] } | { status: 'quoted'; quote: Quote };

export type AnswerPayloadValue = string | number | boolean;

export interface QuoteRequest {
  answers: Record<QuestionId, AnswerPayloadValue>;
}
