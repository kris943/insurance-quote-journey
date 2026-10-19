import type { HTMLAttributes } from 'react';
import { cx } from '@/utils/cx';
import styles from './Card.module.css';

type CardProps = HTMLAttributes<HTMLElement> & { as?: 'div' | 'section' | 'nav' | 'aside' };

export function Card({ as: Component = 'div', className, ...rest }: CardProps) {
  return <Component className={cx(styles.card, className)} {...rest} />;
}
