import { useId, useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { cx } from '@/utils/cx';
import type { StepNavItem as StepNavModel } from '../../state';
import { StepBadge } from './StepBadge';
import styles from './StepNav.module.css';
import { SubStepItem } from './SubStepItem';

interface StepNavItemProps {
  step: StepNavModel;
  onSelectPage: (index: number) => void;
  onSelectQuote: () => void;
}

export function StepNavItem({ step, onSelectPage, onSelectQuote }: StepNavItemProps) {
  const subListId = useId();
  // `null` = follow the journey (open while current); a boolean = the user's explicit choice.
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null);
  const isExpanded = userExpanded ?? step.status === 'current';
  const isComplete = step.status === 'complete';

  const label = (
    <>
      <StepBadge number={step.number} />
      <span className={styles.stepLabel}>{step.label}</span>
    </>
  );

  const handleSelect = () => {
    if (step.id === 'quote') onSelectQuote();
    else if (step.targetIndex !== null) onSelectPage(step.targetIndex);
  };

  return (
    <li className={cx(styles.step, styles[step.status])}>
      {step.hasSubPages ? (
        <>
          <button
            type="button"
            className={styles.stepHeader}
            aria-expanded={isExpanded}
            aria-controls={subListId}
            onClick={() => setUserExpanded(!isExpanded)}
          >
            {label}
            {isComplete && (
              <Icon name="checkCircle" className={styles.completeIcon} label="Completed" />
            )}
            <Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} />
          </button>
          {isExpanded && (
            <ul id={subListId} className={styles.subList}>
              {step.pages.map((page) => (
                <SubStepItem key={page.id} page={page} onSelect={onSelectPage} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <button
          type="button"
          className={styles.stepHeader}
          aria-current={step.status === 'current' ? 'step' : undefined}
          disabled={!step.isNavigable}
          onClick={handleSelect}
        >
          {label}
          {isComplete && (
            <Icon name="checkCircle" className={styles.completeIcon} label="Completed" />
          )}
        </button>
      )}
    </li>
  );
}
