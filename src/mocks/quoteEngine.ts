import type { QuoteRequest, QuoteResponse } from '@/api';

const REQUIRED_QUESTIONS = ['email', 'phone', 'occupation', 'smokedLast12Months'] as const;

const OCCUPATION_LOADING: Record<string, number> = {
  officeProfessional: 1,
  healthcare: 1.1,
  education: 1,
  trades: 1.35,
  hospitality: 1.15,
  other: 1.2,
};

const BASE_PREMIUM = 54.04;
const SMOKER_LOADING = 1.6;
const PER_CIGARETTE_LOADING = 0.004;
const COVER_AMOUNT = 500_000;

const round2 = (value: number) => Math.round(value * 100) / 100;

export type QuoteEngineResult =
  { ok: true; response: QuoteResponse } | { ok: false; status: number; message: string };

/**
 * Simulates the underwriting service: asks follow-up questions for smokers,
 * otherwise prices the policy.
 */
export function evaluateQuote({ answers }: QuoteRequest): QuoteEngineResult {
  const missing = REQUIRED_QUESTIONS.filter((id) => answers[id] === undefined);
  if (missing.length > 0) {
    return { ok: false, status: 400, message: `Missing answers: ${missing.join(', ')}` };
  }

  const isSmoker = answers.smokedLast12Months === true;
  const cigarettesPerWeek = answers.cigarettesPerWeek;

  if (isSmoker && typeof cigarettesPerWeek !== 'number') {
    return {
      ok: true,
      response: {
        status: 'additionalQuestionsRequired',
        pages: [{ title: 'Smoking Details', questions: ['cigarettesPerWeek'] }],
      },
    };
  }

  const occupationLoading = OCCUPATION_LOADING[String(answers.occupation)] ?? 1.2;
  const smokerLoading = isSmoker
    ? SMOKER_LOADING + PER_CIGARETTE_LOADING * Number(cigarettesPerWeek)
    : 1;

  return {
    ok: true,
    response: {
      status: 'quoted',
      quote: {
        product: 'Life Protect',
        coverAmount: COVER_AMOUNT,
        premium: round2(BASE_PREMIUM * occupationLoading * smokerLoading * 1.2),
      },
    },
  };
}
