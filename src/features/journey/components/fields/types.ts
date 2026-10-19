import type { QuestionId } from '@/api';

export interface QuestionFieldHandlers {
  onChange: (id: QuestionId, value: string) => void;
  onBlur: (id: QuestionId) => void;
}

export interface QuestionFieldBaseProps<TDefinition> extends QuestionFieldHandlers {
  fieldId: string;
  definition: TDefinition;
  value: string;
  error?: string;
}
