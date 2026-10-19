import { Icon } from '@/components/icons/Icon';
import { cx } from '@/utils/cx';
import type { PageNavItem } from '../../state';
import styles from './StepNav.module.css';

interface SubStepItemProps {
  page: PageNavItem;
  onSelect: (index: number) => void;
}

export function SubStepItem({ page, onSelect }: SubStepItemProps) {
  const isCurrent = page.status === 'current';
  const isComplete = page.status === 'complete';

  return (
    <li>
      <button
        type="button"
        className={cx(styles.subItem, isComplete && styles.subItemComplete)}
        aria-current={isCurrent ? 'step' : undefined}
        disabled={!page.isNavigable}
        onClick={() => onSelect(page.index)}
      >
        <span className={styles.dot} aria-hidden />
        {page.title}
        {isComplete && (
          <Icon name="checkCircle" className={styles.completeIcon} label="Completed" />
        )}
      </button>
    </li>
  );
}
