import { Card } from '@/components/ui';
import type { StepNavItem as StepNavModel } from '../../state';
import styles from './StepNav.module.css';
import { StepNavItem } from './StepNavItem';

interface StepNavProps {
  steps: StepNavModel[];
  onSelectPage: (index: number) => void;
  onSelectQuote: () => void;
}

export function StepNav({ steps, onSelectPage, onSelectQuote }: StepNavProps) {
  return (
    <Card as="nav" className={styles.nav} aria-label="Application progress">
      <ol className={styles.list}>
        {steps.map((step) => (
          <StepNavItem
            key={step.id}
            step={step}
            onSelectPage={onSelectPage}
            onSelectQuote={onSelectQuote}
          />
        ))}
      </ol>
    </Card>
  );
}
