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
  currentCommandIndex?: number;
  disabled?: boolean;
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
  currentCommandIndex = -1,
  disabled = false,
}) => {
  const isLimitReached = maxCommands !== undefined && commandCount >= maxCommands;
  const canAddCommand = !disabled && !isExecuting && !isLimitReached;

  return (
    <div className={styles.controlsContainer}>
      <CommandQueue commands={commandQueue} currentCommandIndex={currentCommandIndex} />

      {/* Action Buttons - Right after queue */}
      <div className={styles.actionButtons}>
        <button onClick={onPlay} disabled={disabled || isExecuting || !hasCommands} className={styles.playBtn}>
          <FaPlay /> PLAY
        </button>
        <button onClick={onReset} className={styles.resetBtn} disabled={disabled}>
          <FaUndo /> Reset
        </button>
      </div>

      <div className={styles.controls}>
        {maxCommands !== undefined && (
          <div className={styles.commandCounter}>
            <strong>Comandos Máximos nesse nível:</strong> {commandCount} / {maxCommands}
            {isLimitReached && <span className={styles.limitWarning}> ⚠️ Limite atingido!</span>}
          </div>
        )}

        {/* Movement Commands */}
        <div className={styles.commandGroup}>
          <button onClick={() => onAddCommand('LEFT')} disabled={!canAddCommand}>
            <FaArrowLeft /> Girar Esq
          </button>
          <button onClick={() => onAddCommand('MOVE')} disabled={!canAddCommand}>
            <FaArrowUp /> Frente
          </button>
          <button onClick={() => onAddCommand('RIGHT')} disabled={!canAddCommand}>
            Girar Dir <FaArrowRight />
          </button>
        </div>

        {/* Function Calls */}
        {(functionLimits?.F0 !== undefined || functionLimits?.F1 !== undefined || functionLimits?.F2 !== undefined) && (
          <div className={styles.commandGroup}>
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
          </div>
        )}

        {/* Paint Commands */}
        <div className={styles.commandGroup}>
          <button onClick={() => onAddCommand('PAINT_RED')} disabled={!canAddCommand} className={styles.btnRed} title="Pintar Vermelho">🟥 Pintar</button>
          <button onClick={() => onAddCommand('PAINT_GREEN')} disabled={!canAddCommand} className={styles.btnGreen} title="Pintar Verde">🟩 Pintar</button>
          <button onClick={() => onAddCommand('PAINT_BLUE')} disabled={!canAddCommand} className={styles.btnBlue} title="Pintar Azul">🟦 Pintar</button>
        </div>

        {/* Conditional Commands */}
        <div className={styles.commandGroup}>
          <button onClick={() => onAddCommand('IF_RED')} disabled={!canAddCommand} className={styles.btnIfRed} title="Se estiver no Vermelho">Se 🟥</button>
          <button onClick={() => onAddCommand('IF_GREEN')} disabled={!canAddCommand} className={styles.btnIfGreen} title="Se estiver no Verde">Se 🟩</button>
          <button onClick={() => onAddCommand('IF_BLUE')} disabled={!canAddCommand} className={styles.btnIfBlue} title="Se estiver no Azul">Se 🟦</button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
