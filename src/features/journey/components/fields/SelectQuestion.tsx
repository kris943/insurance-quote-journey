import { fieldA11yProps, FormField, Select } from '@/components/ui';
import type { ChoiceQuestion } from '../../questions';
import type { QuestionFieldBaseProps } from './types';

export function SelectQuestion({
  fieldId,
  definition,
  value,
  error,
  onChange,
  onBlur,
}: QuestionFieldBaseProps<ChoiceQuestion>) {
  const { id, label, hint, options, placeholder } = definition;

  return (
    <FormField id={fieldId} label={label} hint={hint} error={error}>
      <Select
        id={fieldId}
        name={id}
        options={options}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
        onBlur={() => onBlur(id)}
        {...fieldA11yProps(fieldId, { hint, error })}
      />
    </FormField>
  );
}
