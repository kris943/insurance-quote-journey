import { useCallback, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { Alert, Button } from '@/components/ui';
import { usePageForm } from '../hooks';
import { questionFieldId } from '../questions';
import type { Answers, JourneyPage } from '../state';
import { QuestionField } from './fields/QuestionField';
import { PageCard } from './PageCard/PageCard';
import { getPageIcon } from './pageIcons';
import styles from './QuestionPage.module.css';

interface QuestionPageProps {
  page: JourneyPage;
  answers: Answers;
  isFirstPage: boolean;
  isLastPage: boolean;
  isSubmitting: boolean;
  submitError?: Error;
  onNext: () => void;
  onBack: () => void;
}

/** Renders one journey page. Key it by `page.id` so form state resets per page. */
export function QuestionPage({
  page,
  answers,
  isFirstPage,
  isLastPage,
  isSubmitting,
  submitError,
  onNext,
  onBack,
}: QuestionPageProps) {
  const { errors, handleChange, handleBlur, validate } = usePageForm(page.questions, answers);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) return;

      // flushSync so error messages are in the DOM before focus moves to the field.
      const firstInvalid = flushSync(validate);
      if (firstInvalid) {
        document.getElementById(questionFieldId(firstInvalid))?.focus();
        return;
      }
      onNext();
    },
    [isSubmitting, onNext, validate],
  );

  const footer = (
    <>
      <Button variant="secondary" leadingIcon="chevronLeft" onClick={onBack} disabled={isFirstPage}>
        Back
      </Button>
      <Button type="submit" trailingIcon="chevronRight" isLoading={isSubmitting}>
        {isSubmitting ? 'Getting your quote…' : isLastPage ? 'Get quote' : 'Next'}
      </Button>
    </>
  );

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <PageCard icon={getPageIcon(page.title)} title={page.title} footer={footer}>
        {page.questions.map((id) => (
          <QuestionField
            key={id}
            questionId={id}
            value={answers[id] ?? ''}
            error={errors[id]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ))}
        {submitError && <Alert>{submitError.message}</Alert>}
      </PageCard>
    </form>
  );
}
