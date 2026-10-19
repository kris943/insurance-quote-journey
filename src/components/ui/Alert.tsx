import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import styles from './Alert.module.css';

export function Alert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className={styles.alert}>
      <Icon name="alertCircle" />
      <div>{children}</div>
    </div>
  );
}
