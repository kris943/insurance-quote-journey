import type { InputHTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import styles from './Field.module.css';

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(styles.control, className)} {...rest} />;
}
