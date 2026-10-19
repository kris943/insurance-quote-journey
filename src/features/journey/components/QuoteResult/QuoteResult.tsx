import type { Quote } from '@/api';
import { Button } from '@/components/ui';
import type { AnswerSummarySection } from '../../state';
import { PageCard } from '../PageCard/PageCard';
import { AnswerSummary } from './AnswerSummary';
import { QuoteHighlight } from './QuoteHighlight';
import styles from './QuoteResult.module.css';

interface QuoteResultProps {
  quote: Quote;
  summary: AnswerSummarySection[];
  onBack: () => void;
  onEdit: (pageIndex: number) => void;
  onRestart: () => void;
}

export function QuoteResult({ quote, summary, onBack, onEdit, onRestart }: QuoteResultProps) {
  const footer = (
    <>
      <Button variant="secondary" leadingIcon="chevronLeft" onClick={onBack}>
        Back
      </Button>
      <Button variant="secondary" leadingIcon="refresh" onClick={onRestart}>
        Start a new quote
      </Button>
    </>
  );

  return (
    <PageCard icon="shield" title="Your Quote" footer={footer}>
      <QuoteHighlight quote={quote} />
      <AnswerSummary sections={summary} onEdit={onEdit} />
      <p className={styles.disclaimer}>
        This is an indicative quote based on the information provided and is subject to
        underwriting.
      </p>
    </PageCard>
  );
}
