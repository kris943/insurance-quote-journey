import type { ReactNode } from 'react';
import styles from './JourneyLayout.module.css';

export function JourneyLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
