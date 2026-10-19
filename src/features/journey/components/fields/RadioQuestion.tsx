import { RadioGroup } from '@/components/ui';
import type { ChoiceQuestion } from '../../questions';
import type { QuestionFieldBaseProps } from './types';

export function RadioQuestion({
  fieldId,
  definition,
  value,
  error,
  onChange,
  onBlur,
}: QuestionFieldBaseProps<ChoiceQuestion>) {
  const { id, label, hint, options } = definition;

  return (
    <RadioGroup
      id={fieldId}
      name={id}
      legend={label}
      options={options}
      value={value}
      hint={hint}
      error={error}
      onChange={(next) => onChange(id, next)}
      onBlur={() => onBlur(id)}
    />
  );
}
