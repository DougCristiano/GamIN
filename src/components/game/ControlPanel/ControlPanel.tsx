/**
 * ControlPanel Component
 * Game control buttons (movement, functions, play, reset)
 */

import { FaArrowLeft, FaArrowUp, FaArrowRight, FaPlay, FaUndo } from 'react-icons/fa';
import type { Command } from '@/types';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  onAddCommand: (cmd: Command) => void;
  onPlay: () => void;
  onReset: () => void;
  isExecuting: boolean;
  hasCommands: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddCommand,
  onPlay,
  onReset,
  isExecuting,
  hasCommands,
}) => {
  return (
    <div className={styles.controls}>
      <button onClick={() => onAddCommand('LEFT')} disabled={isExecuting}>
        <FaArrowLeft /> Girar Esq
      </button>
      <button onClick={() => onAddCommand('MOVE')} disabled={isExecuting}>
        <FaArrowUp /> Frente
      </button>
      <button onClick={() => onAddCommand('RIGHT')} disabled={isExecuting}>
        Girar Dir <FaArrowRight />
      </button>
      <button
        onClick={() => onAddCommand('F0')}
        className={styles.functionCallBtn}
        disabled={isExecuting}
      >
        F0
      </button>
      <button
        onClick={() => onAddCommand('F1')}
        className={styles.functionCallBtn}
        disabled={isExecuting}
      >
        F1
      </button>
      <button
        onClick={() => onAddCommand('F2')}
        className={styles.functionCallBtn}
        disabled={isExecuting}
      >
        F2
      </button>
      <button onClick={onPlay} disabled={isExecuting || !hasCommands} className={styles.playBtn}>
        <FaPlay /> PLAY
      </button>
      <button onClick={onReset} className={styles.resetBtn}>
        <FaUndo /> Reset
      </button>
    </div>
  );
};

export default ControlPanel;
