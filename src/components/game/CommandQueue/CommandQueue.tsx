/**
 * CommandQueue Component
 * Displays the current queue of commands
 */

import type { Command } from '@/types';
import styles from './CommandQueue.module.css';

interface CommandQueueProps {
  commands: Command[];
}

export const CommandQueue: React.FC<CommandQueueProps> = ({ commands }) => {
  const getCommandLabel = (cmd: Command): string => {
    switch (cmd) {
      case 'MOVE':
        return 'MOVE';
      case 'LEFT':
        return 'LEFT';
      case 'RIGHT':
        return 'RIGHT';
      default:
        return cmd;
    }
  };

  return (
    <div className={styles.queueDisplay}>
      <strong>Fila de Comandos:</strong>
      {commands.length === 0 ? (
        <span className={styles.emptyText}>vazia</span>
      ) : (
        <div className={styles.commandList}>
          {commands.map((cmd, index) => (
            <span key={index} className={styles.commandItem}>
              {cmd.startsWith('F') ? (
                <span className={styles.functionBadge}>{getCommandLabel(cmd)}</span>
              ) : (
                getCommandLabel(cmd)
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandQueue;
