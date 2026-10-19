import { Icon } from '../icons/Icon';
import styles from './Field.module.css';
import { errorId, hintId } from './fieldA11y';

interface FieldMessagesProps {
  id: string;
  hint?: string;
  error?: string;
}

export function FieldMessages({ id, hint, error }: FieldMessagesProps) {
  return (
    <>
      {hint && (
        <p id={hintId(id)} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId(id)} className={styles.error}>
          <Icon name="alertCircle" size={14} />
          {error}
        </p>
      )}
    </>
  );
}
