import type { QuestionId } from '@/api';
import type { Answers } from '../state/types';
import { getQuestionDefinition } from './registry';
import { runValidators } from './validators';

export type FieldErrors = Partial<Record<QuestionId, string>>;

export function validateQuestions(
  questionIds: readonly QuestionId[],
  answers: Answers,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const id of questionIds) {
    const error = runValidators(getQuestionDefinition(id).validators, answers[id] ?? '');
    if (error) errors[id] = error;
  }
  return errors;
}
