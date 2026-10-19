import type { Quote } from '@/api';
import { formatCurrency, formatWholeCurrency } from '@/utils/format';
import styles from './QuoteResult.module.css';

export function QuoteHighlight({ quote }: { quote: Quote }) {
  return (
    <div className={styles.highlight}>
      <div>
        <p className={styles.product}>{quote.product}</p>
        <p className={styles.premium} data-testid="quote-premium">
          {formatCurrency(quote.premium)}
          <span className={styles.period}> / month</span>
        </p>
      </div>
      <div className={styles.cover}>
        <p className={styles.coverLabel}>Cover amount</p>
        <p className={styles.coverValue}>{formatWholeCurrency(quote.coverAmount)}</p>
      </div>
    </div>
  );
}
