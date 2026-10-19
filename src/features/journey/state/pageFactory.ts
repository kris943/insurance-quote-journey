import type { ApiPage, QuestionId } from '@/api';
import type { JourneyPage, PageSource, QuestionStepId } from './types';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const askedQuestions = (pages: readonly JourneyPage[]) =>
  new Set<QuestionId>(pages.flatMap((page) => page.questions));

/**
 * Maps API pages into journey pages, dropping questions that were already
 * asked earlier and any page left empty as a result.
 */
export function createJourneyPages(
  apiPages: readonly ApiPage[],
  existingPages: readonly JourneyPage[],
  stepId: QuestionStepId,
  source: PageSource,
): JourneyPage[] {
  const asked = askedQuestions(existingPages);
  const pages: JourneyPage[] = [];

  for (const apiPage of apiPages) {
    const questions = apiPage.questions.filter((id) => !asked.has(id));
    if (questions.length === 0) continue;

    questions.forEach((id) => asked.add(id));
    pages.push({
      id: `${source}-${existingPages.length + pages.length}-${slugify(apiPage.title)}`,
      title: apiPage.title,
      stepId,
      source,
      questions,
    });
  }

  return pages;
}

/** True when the API is asking for at least one question we haven't asked yet. */
export const hasUnaskedQuestions = (
  apiPages: readonly ApiPage[],
  existingPages: readonly JourneyPage[],
): boolean => {
  const asked = askedQuestions(existingPages);
  return apiPages.some((page) => page.questions.some((id) => !asked.has(id)));
};
