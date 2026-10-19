import type { QuestionId } from '@/api';
import type { ChoiceOption, QuestionDefinition } from './types';
import { auPhone, email, integerInRange, oneOf, required } from './validators';

const OCCUPATION_OPTIONS: ChoiceOption[] = [
  { value: 'officeProfessional', label: 'Office / Professional' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'trades', label: 'Trades / Manual work' },
  { value: 'hospitality', label: 'Hospitality / Retail' },
  { value: 'other', label: 'Other' },
];

const YES_NO_OPTIONS: ChoiceOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const values = (options: ChoiceOption[]) => options.map((o) => o.value);

/**
 * Single source of truth for how each API question id is rendered and
 * validated. Supporting a new question is a one-entry change here.
 */
const QUESTION_REGISTRY: Record<QuestionId, QuestionDefinition> = {
  email: {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'name@example.com',
    autoComplete: 'email',
    validators: [required('Enter your email address'), email()],
    serialize: (value) => value.trim(),
  },
  phone: {
    id: 'phone',
    type: 'tel',
    label: 'Phone Number',
    placeholder: '0400 000 000',
    autoComplete: 'tel',
    inputMode: 'tel',
    validators: [required('Enter your phone number'), auPhone()],
    serialize: (value) => value.replace(/[\s()-]/g, ''),
  },
  occupation: {
    id: 'occupation',
    type: 'select',
    label: 'What is your occupation?',
    placeholder: 'Select an option',
    options: OCCUPATION_OPTIONS,
    validators: [required('Select your occupation'), oneOf(values(OCCUPATION_OPTIONS))],
  },
  smokedLast12Months: {
    id: 'smokedLast12Months',
    type: 'radio',
    label: 'Have you smoked in the last 12 months?',
    options: YES_NO_OPTIONS,
    validators: [required('Select Yes or No'), oneOf(values(YES_NO_OPTIONS))],
    serialize: (value) => value === 'yes',
  },
  cigarettesPerWeek: {
    id: 'cigarettesPerWeek',
    type: 'number',
    label: 'How many cigarettes do you smoke per week?',
    hint: 'An estimate is fine.',
    placeholder: 'e.g. 20',
    inputMode: 'numeric',
    validators: [required('Enter the number of cigarettes per week'), integerInRange(1, 1000)],
    serialize: Number,
  },
};

/** "cigarettesPerWeek" -> "Cigarettes per week" */
const humanize = (id: string) => {
  const words = id.replace(/([a-z\d])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const fallbackCache = new Map<QuestionId, QuestionDefinition>();

/**
 * Unknown ids degrade to a required free-text question rather than breaking
 * the journey, so the backend can ship new questions ahead of the frontend.
 */
export function getQuestionDefinition(id: QuestionId): QuestionDefinition {
  const known = QUESTION_REGISTRY[id];
  if (known) return known;

  let fallback = fallbackCache.get(id);
  if (!fallback) {
    if (import.meta.env.DEV) console.warn(`[questions] No definition for "${id}", using fallback.`);
    fallback = { id, type: 'text', label: humanize(id), validators: [required()] };
    fallbackCache.set(id, fallback);
  }
  return fallback;
}

/** Human-readable answer, e.g. for a review summary. */
export function formatAnswer(id: QuestionId, value: string): string {
  const definition = getQuestionDefinition(id);
  if (definition.type === 'select' || definition.type === 'radio') {
    return definition.options.find((o) => o.value === value)?.label ?? value;
  }
  return value;
}
