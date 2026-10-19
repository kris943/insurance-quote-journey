export const hintId = (id: string) => `${id}-hint`;
export const errorId = (id: string) => `${id}-error`;

/** ARIA wiring shared by every form control so hints and errors are announced. */
export function fieldA11yProps(id: string, { hint, error }: { hint?: string; error?: string }) {
  const describedBy = [hint && hintId(id), error && errorId(id)].filter(Boolean).join(' ');
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
  } as const;
}
