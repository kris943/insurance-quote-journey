import type { ChangeEvent } from 'react';
import { fieldA11yProps, FormField, TextInput } from '@/components/ui';
import type { InputQuestion as InputQuestionDefinition } from '../../questions';
import type { QuestionFieldBaseProps } from './types';

export function InputQuestion({
  fieldId,
  definition,
  value,
  error,
  onChange,
  onBlur,
}: QuestionFieldBaseProps<InputQuestionDefinition>) {
  const { id, label, hint, type, placeholder, autoComplete, inputMode } = definition;

  return (
    <FormField id={fieldId} label={label} hint={hint} error={error}>
      <TextInput
        id={fieldId}
        name={id}
        // Numbers use a text input + inputMode to avoid wheel/locale quirks of type="number".
        type={type === 'number' ? 'text' : type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(id, event.target.value)}
        onBlur={() => onBlur(id)}
        {...fieldA11yProps(fieldId, { hint, error })}
      />
    </FormField>
  );
}
