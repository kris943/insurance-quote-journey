import { Button } from '@/components/ui';
import type { AnswerSummarySection } from '../../state';
import styles from './QuoteResult.module.css';

interface AnswerSummaryProps {
  sections: AnswerSummarySection[];
  onEdit: (pageIndex: number) => void;
}

export function AnswerSummary({ sections, onEdit }: AnswerSummaryProps) {
  return (
    <section aria-labelledby="answer-summary-title">
      <h3 id="answer-summary-title" className={styles.summaryTitle}>
        Your answers
      </h3>
      {sections.map((section) => (
        <div key={section.pageId} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>{section.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(section.pageIndex)}
              aria-label={`Edit ${section.title}`}
            >
              Edit
            </Button>
          </div>
          <dl className={styles.list}>
            {section.items.map((item) => (
              <div key={item.id} className={styles.row}>
                <dt>{item.label}</dt>
                <dd>{item.value || '—'}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  );
}
