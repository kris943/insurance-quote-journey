import { useCallback, useMemo, useState } from 'react';
import type { QuestionId } from '@/api';
import { validateQuestions, type FieldErrors } from '../questions';
import { journeyActions, useJourneyDispatch, type Answers } from '../state';

/**
 * Form state for a single journey page.
 * Errors are derived from answers (never stored), and only surfaced once a
 * field has been blurred or the customer has tried to continue.
 * Callers should key the page by id so touched state resets between pages.
 */
export function usePageForm(questionIds: readonly QuestionId[], answers: Answers) {
  const dispatch = useJourneyDispatch();
  const [touched, setTouched] = useState<ReadonlySet<QuestionId>>(() => new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const allErrors = useMemo(() => validateQuestions(questionIds, answers), [questionIds, answers]);

  const visibleErrors = useMemo<FieldErrors>(() => {
    if (submitAttempted) return allErrors;
    const errors: FieldErrors = {};
    for (const id of touched) if (allErrors[id]) errors[id] = allErrors[id];
    return errors;
  }, [allErrors, submitAttempted, touched]);

  const handleChange = useCallback(
    (id: QuestionId, value: string) => dispatch(journeyActions.answerChanged(id, value)),
    [dispatch],
  );

  const handleBlur = useCallback((id: QuestionId) => {
    setTouched((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  /** Reveals all errors and returns the first invalid question id, if any. */
  const validate = useCallback((): QuestionId | undefined => {
    setSubmitAttempted(true);
    return questionIds.find((id) => allErrors[id]);
  }, [allErrors, questionIds]);

  return { errors: visibleErrors, handleChange, handleBlur, validate };
}
