import { useId, useRef, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons/Icon';
import { Card } from '@/components/ui';
import { useFocusOnMount } from '@/hooks/useFocusOnMount';
import styles from './PageCard.module.css';

interface PageCardProps {
  icon: IconName;
  title: string;
  footer: ReactNode;
  children: ReactNode;
}

/** Card shell for every journey page. Focuses its heading on mount so page changes are announced. */
export function PageCard({ icon, title, footer, children }: PageCardProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useFocusOnMount(headingRef);

  return (
    <Card as="section" className={styles.card} aria-labelledby={headingId}>
      <header className={styles.header}>
        <span className={styles.iconBox}>
          <Icon name={icon} size={18} />
        </span>
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className={styles.title}>
          {title}
        </h2>
      </header>
      <div className={styles.body}>{children}</div>
      <footer className={styles.footer}>{footer}</footer>
    </Card>
  );
}
