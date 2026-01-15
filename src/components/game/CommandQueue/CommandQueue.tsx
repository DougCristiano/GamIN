/**
 * CommandQueue Component
 * Displays the current queue of commands
 */

import { FaArrowLeft, FaArrowUp, FaArrowRight } from 'react-icons/fa';
import type { Command } from '@/types';
import styles from './CommandQueue.module.css';

interface CommandQueueProps {
  commands: Command[];
}

export const CommandQueue: React.FC<CommandQueueProps> = ({ commands }) => {
  const renderCommand = (cmd: Command, index: number) => {
    if (cmd === 'MOVE') {
      return <FaArrowUp key={index} size={16} color="#3b82f6" />;
    }
    if (cmd === 'LEFT') {
      return <FaArrowLeft key={index} size={16} color="#3b82f6" />;
    }
    if (cmd === 'RIGHT') {
      return <FaArrowRight key={index} size={16} color="#3b82f6" />;
    }
    // Function calls (F0, F1, F2)
    return (
      <span key={index} className={styles.functionBadge}>
        {cmd}
      </span>
    );
  };

  return (
    <div className={styles.queueDisplay}>
      <strong>Fila de Comandos:</strong>
      {commands.length === 0 ? (
        <span className={styles.emptyText}>(vazia)</span>
      ) : (
        <div className={styles.commandList}>
          {commands.map((cmd, index) => (
            <span key={index} className={styles.commandItem}>
              {renderCommand(cmd, index)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandQueue;
