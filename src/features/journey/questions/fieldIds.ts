import type { QuestionId } from '@/api';

/** DOM id for a question's (first) focusable control. */
export const questionFieldId = (id: QuestionId) => `q-${id}`;
