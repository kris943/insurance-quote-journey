import { Icon } from '@/components/icons/Icon';
import { Button, Card } from '@/components/ui';
import styles from './Status.module.css';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <Card className={styles.status} role="alert">
      <Icon name="alertCircle" size={28} />
      <p className={styles.title}>{title}</p>
      <p>{message}</p>
      <Button leadingIcon="refresh" onClick={onRetry}>
        Try again
      </Button>
    </Card>
  );
}
