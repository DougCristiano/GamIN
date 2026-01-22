/**
 * ControlPanel Component
 * Game control buttons (movement, functions, play, reset)
 */

import { FaArrowUp, FaPlay, FaUndo, FaRedo, FaPaintBrush } from 'react-icons/fa';
import type { Command, FunctionLimits } from '@/types';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  onAddCommand: (cmd: Command) => void;
  isExecuting: boolean;
  commandCount: number;
  maxCommands?: number;
  functionLimits?: FunctionLimits;
  disabled?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddCommand,
  isExecuting,
  commandCount,
  maxCommands,
  functionLimits,
  disabled = false,
}) => {
  const isLimitReached = maxCommands !== undefined && commandCount >= maxCommands;
  const canAddCommand = !disabled && !isExecuting && !isLimitReached;

  return (
    <div className={styles.controlsContainer}>
      <div className={styles.controls}>
        {maxCommands !== undefined && (
          <div className={styles.commandCounter}>
            <strong>Comandos Máximos nesse nível:</strong> {commandCount} / {maxCommands}
            {isLimitReached && <span className={styles.limitWarning}> ⚠️ Limite atingido!</span>}
          </div>
        )}

        <div className={styles.gamepadLayout}>
          {/* Left Side - Movement (D-Pad style) */}
          <div className={styles.gamepadLeft}>
            <div className={styles.dpadContainer}>
              {/* Arrange as D-Pad visually if possible via CSS grid later */}
              <button onClick={() => onAddCommand('LEFT')} disabled={!canAddCommand} className={styles.dpadBtn}>
                <FaUndo />
              </button>
              <button onClick={() => onAddCommand('MOVE')} disabled={!canAddCommand} className={styles.dpadBtn}>
                <FaArrowUp />
              </button>
              <button onClick={() => onAddCommand('RIGHT')} disabled={!canAddCommand} className={styles.dpadBtn}>
                <FaRedo />
              </button>
            </div>
            <div className={styles.dpadLabel}>MOVIMENTO</div>
          </div>

          {/* Right Side - Actions (Functions, Paints, Checks) */}
          <div className={styles.gamepadRight}>
            {(functionLimits?.F0 !== undefined || functionLimits?.F1 !== undefined || functionLimits?.F2 !== undefined) && (
              <div className={styles.actionGroup}>
                {functionLimits?.F0 !== undefined && (
                  <button onClick={() => onAddCommand('F0')} className={styles.functionCallBtn} disabled={!canAddCommand}>F0</button>
                )}
                {functionLimits?.F1 !== undefined && (
                  <button onClick={() => onAddCommand('F1')} className={styles.functionCallBtn} disabled={!canAddCommand}>F1</button>
                )}
                {functionLimits?.F2 !== undefined && (
                  <button onClick={() => onAddCommand('F2')} className={styles.functionCallBtn} disabled={!canAddCommand}>F2</button>
                )}
              </div>
            )}

            <div className={styles.actionGroup}>
              <button onClick={() => onAddCommand('PAINT_RED')} disabled={!canAddCommand} className={styles.btnRed} title="Pintar Vermelho">
                <FaPaintBrush />
              </button>
              <button onClick={() => onAddCommand('PAINT_GREEN')} disabled={!canAddCommand} className={styles.btnGreen} title="Pintar Verde">
                <FaPaintBrush />
              </button>
              <button onClick={() => onAddCommand('PAINT_BLUE')} disabled={!canAddCommand} className={styles.btnBlue} title="Pintar Azul">
                <FaPaintBrush />
              </button>
            </div>

            <div className={styles.actionGroup}>
              <button onClick={() => onAddCommand('IF_RED')} disabled={!canAddCommand} className={styles.btnIfRed} title="Se Vermelho">Se</button>
              <button onClick={() => onAddCommand('IF_GREEN')} disabled={!canAddCommand} className={styles.btnIfGreen} title="Se Verde">Se</button>
              <button onClick={() => onAddCommand('IF_BLUE')} disabled={!canAddCommand} className={styles.btnIfBlue} title="Se Azul">Se</button>
            </div>
            <div className={styles.actionLabel}>AÇÕES</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Novo componente para os botões de ação (Play/Reset)
interface ActionButtonsProps {
  onPlay: () => void;
  onReset: () => void;
  isExecuting: boolean;
  hasCommands: boolean;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPlay,
  onReset,
  isExecuting,
  hasCommands,
  disabled = false,
}) => {
  return (
    <div className={styles.actionButtons}>
      <button onClick={onPlay} disabled={disabled || isExecuting || !hasCommands} className={styles.playBtn}>
        <FaPlay /> PLAY
      </button>
      <button onClick={onReset} className={styles.resetBtn} disabled={disabled}>
        <FaUndo /> Reset
      </button>
    </div>
  );
};

export default ControlPanel;

