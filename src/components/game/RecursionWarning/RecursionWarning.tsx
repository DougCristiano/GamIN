/**
 * RecursionWarning Component
 * Displays warning when recursion limits are reached
 */

import { FaStar } from 'react-icons/fa';
import styles from './RecursionWarning.module.css';

interface RecursionWarningProps {
  message: string;
  onClose: () => void;
}

export const RecursionWarning: React.FC<RecursionWarningProps> = ({ message, onClose }) => {
  return (
    <div className={styles.warning}>
      <FaStar className={styles.icon} />
      <div className={styles.content}>
        <strong>Limite de Recursão:</strong>
        <div className={styles.message}>{message}</div>
      </div>
      <button onClick={onClose} className={styles.closeBtn} title="Fechar aviso">
        ×
      </button>
    </div>
  );
};

export default RecursionWarning;
