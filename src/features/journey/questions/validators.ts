import type { Validator } from './types';

const isBlank = (value: string) => value.trim().length === 0;

export const required =
  (message = 'This field is required'): Validator =>
  (value) =>
    isBlank(value) ? message : undefined;

/** Pattern-based validators skip blank values so `required` owns that message. */
export const matches =
  (pattern: RegExp, message: string): Validator =>
  (value) =>
    isBlank(value) || pattern.test(value.trim()) ? undefined : message;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const email = (message = 'Enter a valid email address'): Validator =>
  matches(EMAIL_PATTERN, message);

/** Australian mobile or landline, tolerant of spaces, dashes and brackets. */
const AU_PHONE_PATTERN = /^(?:\+?61|0)[2-478]\d{8}$/;
export const auPhone =
  (message = 'Enter a valid Australian phone number, e.g. 0400 000 000'): Validator =>
  (value) =>
    isBlank(value) || AU_PHONE_PATTERN.test(value.replace(/[\s()-]/g, '')) ? undefined : message;

export const integerInRange =
  (
    min: number,
    max: number,
    message = `Enter a whole number between ${min} and ${max}`,
  ): Validator =>
  (value) => {
    if (isBlank(value)) return undefined;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= min && parsed <= max ? undefined : message;
  };

export const oneOf =
  (allowed: readonly string[], message = 'Select one of the available options'): Validator =>
  (value) =>
    isBlank(value) || allowed.includes(value) ? undefined : message;

/** Runs validators in order and returns the first failure. */
export const runValidators = (validators: Validator[], value: string): string | undefined => {
  for (const validate of validators) {
    const error = validate(value);
    if (error) return error;
  }
  return undefined;
};
