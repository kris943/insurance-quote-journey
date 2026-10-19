import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Icon } from '@/components/icons/Icon';
import { Button, Card } from '@/components/ui';
import { Journey, JourneyProvider } from '@/features/journey';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Icon name="shield" size={20} />
        <h1>Life Protect</h1>
      </header>
      <ErrorBoundary
        fallback={(reset) => (
          <Card className={styles.fallback} role="alert">
            <p>Something went wrong. Your answers haven't been submitted.</p>
            <Button onClick={reset}>Start again</Button>
          </Card>
        )}
      >
        <JourneyProvider>
          <Journey />
        </JourneyProvider>
      </ErrorBoundary>
    </div>
  );
}
