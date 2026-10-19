import type { HTMLAttributes } from 'react';
import type { AnswerPayloadValue, QuestionId } from '@/api';

/** Returns an error message when invalid, otherwise `undefined`. */
export type Validator = (value: string) => string | undefined;

export interface ChoiceOption {
  value: string;
  label: string;
}

interface BaseQuestion {
  id: QuestionId;
  label: string;
  hint?: string;
  validators: Validator[];
  /** Converts the raw form value into the shape the API expects. */
  serialize?: (value: string) => AnswerPayloadValue;
}

export interface InputQuestion extends BaseQuestion {
  type: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'select' | 'radio';
  options: ChoiceOption[];
  placeholder?: string;
}

export type QuestionDefinition = InputQuestion | ChoiceQuestion;
export type QuestionType = QuestionDefinition['type'];
