import { memo } from 'react';
import type { QuestionId } from '@/api';
import { getQuestionDefinition, questionFieldId } from '../../questions';
import { InputQuestion } from './InputQuestion';
import { RadioQuestion } from './RadioQuestion';
import { SelectQuestion } from './SelectQuestion';
import type { QuestionFieldHandlers } from './types';

interface QuestionFieldProps extends QuestionFieldHandlers {
  questionId: QuestionId;
  value: string;
  error?: string;
}

/**
 * Resolves a question id to its definition and renders the matching control.
 * Memoised with stable handlers, so typing in one field only re-renders that field.
 */
export const QuestionField = memo(function QuestionField({
  questionId,
  ...props
}: QuestionFieldProps) {
  const definition = getQuestionDefinition(questionId);
  const fieldId = questionFieldId(questionId);

  switch (definition.type) {
    case 'select':
      return <SelectQuestion fieldId={fieldId} definition={definition} {...props} />;
    case 'radio':
      return <RadioQuestion fieldId={fieldId} definition={definition} {...props} />;
    default:
      return <InputQuestion fieldId={fieldId} definition={definition} {...props} />;
  }
});
