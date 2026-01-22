/**
 * CommandQueue Component
 * Displays the current queue of commands
 */

import { FaInbox } from 'react-icons/fa';
import type { Command } from '@/types';
import styles from './CommandQueue.module.css';

interface CommandQueueProps {
  commands: Command[];
  currentCommandIndex?: number;
}

export const CommandQueue: React.FC<CommandQueueProps> = ({ commands, currentCommandIndex = -1 }) => {
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
      {commands.length === 0 ? (
        <div className={styles.emptyState}>
          <FaInbox className={styles.emptyIcon} />
          <span className={styles.emptyText}>Nenhum comando adicionado</span>
        </div>
      ) : (
        <div className={styles.commandList}>
          {commands.map((cmd, index) => (
            <span
              key={index}
              className={`${styles.commandItem} ${index === currentCommandIndex ? styles.executing : ''}`}
            >
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
