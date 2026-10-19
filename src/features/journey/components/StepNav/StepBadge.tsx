import styles from './StepNav.module.css';

export function StepBadge({ number }: { number: number }) {
  return (
    <span className={styles.badge} aria-hidden>
      {number}
    </span>
  );
}
