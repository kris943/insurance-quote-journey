import type { ReactNode } from 'react';
import styles from './Field.module.css';
import { FieldMessages } from './FieldMessages';

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

/** Label + control + hint/error layout for single-control fields. */
export function FormField({ id, label, hint, error, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}
