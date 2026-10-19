import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/utils/cx';
import { Icon, type IconName } from '../icons/Icon';
import styles from './Button.module.css';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'sm';
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  isLoading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], size === 'sm' && styles.sm, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <Spinner size={14} /> : leadingIcon && <Icon name={leadingIcon} />}
      {children}
      {!isLoading && trailingIcon && <Icon name={trailingIcon} />}
    </button>
  );
}
