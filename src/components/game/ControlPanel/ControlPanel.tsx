/**
 * ControlPanel Component
 * Game control buttons (movement, functions, play, reset)
 */

import { FaArrowLeft, FaArrowUp, FaArrowRight, FaPlay, FaUndo } from 'react-icons/fa';
import type { Command, FunctionLimits } from '@/types';
import { CommandQueue } from '../CommandQueue/CommandQueue';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  onAddCommand: (cmd: Command) => void;
  onPlay: () => void;
  onReset: () => void;
  isExecuting: boolean;
  hasCommands: boolean;
  commandCount: number;
  maxCommands?: number;
  functionLimits?: FunctionLimits;
  commandQueue: Command[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddCommand,
  onPlay,
  onReset,
  isExecuting,
  hasCommands,
  commandCount,
  maxCommands,
  functionLimits,
  commandQueue,
}) => {
  const isLimitReached = maxCommands !== undefined && commandCount >= maxCommands;
  const canAddCommand = !isExecuting && !isLimitReached;

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.controls}>
        {maxCommands !== undefined && (
          <div className={styles.commandCounter}>
            <strong>Comandos Máximos nesse nível:</strong> {commandCount} / {maxCommands}
            {isLimitReached && <span className={styles.limitWarning}> ⚠️ Limite atingido!</span>}
          </div>
        )}
        <button onClick={() => onAddCommand('LEFT')} disabled={!canAddCommand}>
          <FaArrowLeft /> Girar Esq
        </button>
        <button onClick={() => onAddCommand('MOVE')} disabled={!canAddCommand}>
          <FaArrowUp /> Frente
        </button>
        <button onClick={() => onAddCommand('RIGHT')} disabled={!canAddCommand}>
          Girar Dir <FaArrowRight />
        </button>
        {functionLimits?.F0 !== undefined && (
          <button
            onClick={() => onAddCommand('F0')}
            className={styles.functionCallBtn}
            disabled={!canAddCommand}
          >
            F0
          </button>
        )}
        {functionLimits?.F1 !== undefined && (
          <button
            onClick={() => onAddCommand('F1')}
            className={styles.functionCallBtn}
            disabled={!canAddCommand}
          >
            F1
          </button>
        )}
        {functionLimits?.F2 !== undefined && (
          <button
            onClick={() => onAddCommand('F2')}
            className={styles.functionCallBtn}
            disabled={!canAddCommand}
          >
            F2
          </button>
        )}
        <button onClick={onPlay} disabled={isExecuting || !hasCommands} className={styles.playBtn}>
          <FaPlay /> PLAY
        </button>
        <button onClick={onReset} className={styles.resetBtn}>
          <FaUndo /> Reset
        </button>
      </div>

      <CommandQueue commands={commandQueue} />
    </div>
  );
};

export default ControlPanel;
