import { Card, Spinner } from '@/components/ui';
import styles from './Status.module.css';

export function LoadingState({ message }: { message: string }) {
  return (
    <Card className={styles.status} role="status" aria-live="polite">
      <Spinner size={24} />
      <p>{message}</p>
    </Card>
  );
}
