import type { SelectHTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import { Icon } from '../icons/Icon';
import styles from './Field.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ options, placeholder, className, value, ...rest }: SelectProps) {
  return (
    <div className={styles.selectWrapper}>
      <select
        className={cx(styles.control, styles.select, !value && styles.placeholder, className)}
        value={value}
        {...rest}
      >
        <option value="" disabled>
          {placeholder ?? 'Select an option'}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" />
    </div>
  );
}
