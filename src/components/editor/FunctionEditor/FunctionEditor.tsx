import { useState } from 'react';
import {
  FaArrowLeft,
  FaArrowUp,
  FaArrowRight,
  FaTrash,
  FaExclamationTriangle,
} from 'react-icons/fa';
import type { Command, FunctionDefinition, FunctionLimits } from '@/types';
import styles from './FunctionEditor.module.css';

interface FunctionEditorProps {
  functions: FunctionDefinition[];
  onFunctionsChange: (functions: FunctionDefinition[]) => void;
  functionLimits?: FunctionLimits;
}

type FunctionName = 'F0' | 'F1' | 'F2';

export const FunctionEditor: React.FC<FunctionEditorProps> = ({ functions, onFunctionsChange, functionLimits }) => {
  const [activeFunction, setActiveFunction] = useState<FunctionName>('F0');

  const getCurrentFunction = (): FunctionDefinition => {
    return functions.find(f => f.name === activeFunction) || { name: activeFunction, commands: [] };
  };

  const getFunctionLimit = (funcName: FunctionName): number | undefined => {
    return functionLimits?.[funcName];
  };

  const isFunctionEnabled = (funcName: FunctionName): boolean => {
    return functionLimits?.[funcName] !== undefined;
  };

  const addCommandToFunction = (command: Command) => {
    const currentFunc = getCurrentFunction();
    const limit = getFunctionLimit(activeFunction);

    // Check if limit is reached
    if (limit !== undefined && currentFunc.commands.length >= limit) {
      return; // Don't add if limit reached
    }

    const updatedFunctions = functions.map(f => {
      if (f.name === activeFunction) {
        return { ...f, commands: [...f.commands, command] };
      }
      return f;
    });

    // If function doesn't exist yet, create it
    if (!functions.find(f => f.name === activeFunction)) {
      updatedFunctions.push({ name: activeFunction, commands: [command] });
    }

    onFunctionsChange(updatedFunctions);
  };

  const removeCommandFromFunction = (index: number) => {
    const updatedFunctions = functions.map(f => {
      if (f.name === activeFunction) {
        const newCommands = [...f.commands];
        newCommands.splice(index, 1);
        return { ...f, commands: newCommands };
      }
      return f;
    });

    onFunctionsChange(updatedFunctions);
  };

  const clearFunction = () => {
    const updatedFunctions = functions.map(f => {
      if (f.name === activeFunction) {
        return { ...f, commands: [] };
      }
      return f;
    });

    onFunctionsChange(updatedFunctions);
  };

  const getCommandIcon = (cmd: Command) => {
    switch (cmd) {
      case 'MOVE':
        return <FaArrowUp />;
      case 'LEFT':
        return <FaArrowLeft />;
      case 'RIGHT':
        return <FaArrowRight />;
      default:
        return null;
    }
  };

  const getCommandLabel = (cmd: Command) => {
    switch (cmd) {
      case 'MOVE':
        return 'Frente';
      case 'LEFT':
        return 'Esq';
      case 'RIGHT':
        return 'Dir';
      default:
        return cmd;
    }
  };

  const currentFunc = getCurrentFunction();
  const hasRecursion = currentFunc.commands.includes(activeFunction as Command);
  const currentLimit = getFunctionLimit(activeFunction);
  const enabledFunctions = (['F0', 'F1', 'F2'] as const).filter(isFunctionEnabled);

  // If no functions enabled, show message
  if (enabledFunctions.length === 0) {
    return (
      <div className={styles.functionEditor}>
        <div className={styles.functionInfo}>
          ℹ️ Nenhuma função disponível neste nível.
        </div>
      </div>
    );
  }

  // Auto-select first enabled function if current is disabled
  if (!isFunctionEnabled(activeFunction) && enabledFunctions.length > 0) {
    setActiveFunction(enabledFunctions[0]);
  }

  return (
    <div className={styles.functionEditor}>
      <div className={styles.functionInfo}>
        💡 <strong>Funções:</strong> Crie sequências de comandos reutilizáveis. Você pode chamar
        outras funções ou até a própria função (recursão)!
      </div>

      {/* Function Tabs */}
      <div className={styles.functionTabs}>
        {enabledFunctions.map(funcName => {
          const func = functions.find(f => f.name === funcName);
          const count = func?.commands.length || 0;
          const isSaved = count > 0;

          return (
            <div
              key={funcName}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}
            >
              <button
                className={`${styles.functionTab} ${activeFunction === funcName ? styles.active : ''}`}
                onClick={() => setActiveFunction(funcName)}
              >
                {funcName} {count > 0 && `(${count})`}
              </button>

              {/* Saved function preview */}
              {isSaved && (
                <div className={styles.functionPreview}>
                  <div className={styles.previewLabel}>{funcName}:</div>
                  <div className={styles.previewCommands}>
                    {func!.commands.map((cmd, idx) => (
                      <span key={idx} className={styles.previewIcon}>
                        {cmd === 'MOVE' ? (
                          <FaArrowUp size={12} />
                        ) : cmd === 'LEFT' ? (
                          <FaArrowLeft size={12} />
                        ) : cmd === 'RIGHT' ? (
                          <FaArrowRight size={12} />
                        ) : (
                          <span className={styles.previewFuncName}>{cmd}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Function Content */}
      <div className={styles.functionContent}>
        <div className={styles.functionTitle}>Definição de {activeFunction}:</div>

        {/* Function Command Counter */}
        {currentLimit !== undefined && (
          <div className={styles.functionCounter}>
            <strong>Comandos na função:</strong> {currentFunc.commands.length} / {currentLimit}
            {currentFunc.commands.length >= currentLimit && (
              <span className={styles.limitWarning}> ⚠️ Limite atingido!</span>
            )}
          </div>
        )}

        {/* Function Commands */}
        <div
          className={`${styles.functionCommands} ${currentFunc.commands.length === 0 ? styles.empty : ''}`}
        >
          {currentFunc.commands.length === 0 ? (
            <div className={styles.emptyState}>Nenhum comando. Adicione comandos abaixo.</div>
          ) : (
            currentFunc.commands.map((cmd, index) => (
              <div
                key={index}
                className={`${styles.commandChip} ${cmd.startsWith('F') ? styles.function : ''}`}
              >
                {getCommandIcon(cmd)}
                <span>{getCommandLabel(cmd)}</span>
                <button
                  className={styles.removeChip}
                  onClick={() => removeCommandFromFunction(index)}
                  title="Remover"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Command Buttons */}
        <div className={styles.functionButtons}>
          <button onClick={() => addCommandToFunction('LEFT')} className={styles.functionBtn} disabled={currentLimit !== undefined && currentFunc.commands.length >= currentLimit}>
            <FaArrowLeft /> Esquerda
          </button>
          <button onClick={() => addCommandToFunction('MOVE')} className={styles.functionBtn} disabled={currentLimit !== undefined && currentFunc.commands.length >= currentLimit}>
            <FaArrowUp /> Frente
          </button>
          <button onClick={() => addCommandToFunction('RIGHT')} className={styles.functionBtn} disabled={currentLimit !== undefined && currentFunc.commands.length >= currentLimit}>
            <FaArrowRight /> Direita
          </button>
          <button onClick={() => addCommandToFunction('F0')} className={styles.functionBtn} disabled={currentLimit !== undefined && currentFunc.commands.length >= currentLimit || !isFunctionEnabled('F0')}>
            F0
          </button>
          <button onClick={() => addCommandToFunction('F1')} className={styles.functionBtn} disabled={currentLimit !== undefined && currentFunc.commands.length >= currentLimit || !isFunctionEnabled('F1')}>
            F1
          </button>
          <button onClick={() => addCommandToFunction('F2')} className={styles.functionBtn} disabled={currentLimit !== undefined && currentFunc.commands.length >= currentLimit || !isFunctionEnabled('F2')}>
            F2
          </button>
          <button
            onClick={clearFunction}
            className={`${styles.functionBtn} ${styles.clearBtn}`}
            disabled={currentFunc.commands.length === 0}
          >
            <FaTrash /> Limpar
          </button>
        </div>

        {/* Recursion Warning */}
        {hasRecursion && (
          <div className={styles.recursionWarning}>
            <FaExclamationTriangle />
            <span>
              <strong>Atenção:</strong> Esta função chama a si mesma (recursão). Certifique-se de
              ter uma condição de parada para evitar loops infinitos!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionEditor;
