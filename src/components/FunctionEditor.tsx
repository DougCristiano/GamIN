import React, { useState } from 'react';
import styles from './FunctionEditor.module.css';
import { FaArrowLeft, FaArrowUp, FaArrowRight, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import type { Command, FunctionDefinition } from '../types/tipos';

interface FunctionEditorProps {
    functions: FunctionDefinition[];
    onFunctionsChange: (functions: FunctionDefinition[]) => void;
}

const FunctionEditor: React.FC<FunctionEditorProps> = ({ functions, onFunctionsChange }) => {
    const [activeFunction, setActiveFunction] = useState<'F0' | 'F1' | 'F2'>('F0');

    const getCurrentFunction = (): FunctionDefinition => {
        return functions.find(f => f.name === activeFunction) || { name: activeFunction, commands: [] };
    };

    const addCommandToFunction = (command: Command) => {
        const updatedFunctions = functions.map(f => {
            if (f.name === activeFunction) {
                return { ...f, commands: [...f.commands, command] };
            }
            return f;
        });

        // Se a função não existe ainda, cria
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
            case 'MOVE': return <FaArrowUp />;
            case 'LEFT': return <FaArrowLeft />;
            case 'RIGHT': return <FaArrowRight />;
            default: return null;
        }
    };

    const getCommandLabel = (cmd: Command) => {
        switch (cmd) {
            case 'MOVE': return 'Frente';
            case 'LEFT': return 'Esq';
            case 'RIGHT': return 'Dir';
            default: return cmd;
        }
    };

    const currentFunc = getCurrentFunction();
    const hasRecursion = currentFunc.commands.includes(activeFunction as Command);

    return (
        <div className={styles.functionEditor}>
            <div className={styles.functionInfo}>
                💡 <strong>Funções:</strong> Crie sequências de comandos reutilizáveis. Você pode chamar outras funções ou até a própria função (recursão)!
            </div>

            {/* Tabs de Funções */}
            <div className={styles.functionTabs}>
                {(['F0', 'F1', 'F2'] as const).map(funcName => {
                    const func = functions.find(f => f.name === funcName);
                    const count = func?.commands.length || 0;
                    const isSaved = count > 0;

                    return (
                        <div key={funcName} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                            <button
                                className={`${styles.functionTab} ${activeFunction === funcName ? styles.active : ''}`}
                                onClick={() => setActiveFunction(funcName)}
                            >
                                {funcName} {count > 0 && `(${count})`}
                            </button>

                            {/* Preview da função salva */}
                            {isSaved && (
                                <div className={styles.functionPreview}>
                                    <div className={styles.previewLabel}>{funcName}:</div>
                                    <div className={styles.previewCommands}>
                                        {func!.commands.map((cmd, idx) => (
                                            <span key={idx} className={styles.previewIcon}>
                                                {cmd === 'MOVE' ? <FaArrowUp size={12} /> :
                                                    cmd === 'LEFT' ? <FaArrowLeft size={12} /> :
                                                        cmd === 'RIGHT' ? <FaArrowRight size={12} /> :
                                                            <span className={styles.previewFuncName}>{cmd}</span>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Conteúdo da Função */}
            <div className={styles.functionContent}>
                <div className={styles.functionTitle}>
                    Definição de {activeFunction}:
                </div>

                {/* Comandos da Função */}
                <div className={`${styles.functionCommands} ${currentFunc.commands.length === 0 ? styles.empty : ''}`}>
                    {currentFunc.commands.length === 0 ? (
                        <div className={styles.emptyState}>
                            Nenhum comando. Adicione comandos abaixo.
                        </div>
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

                {/* Botões para Adicionar Comandos */}
                <div className={styles.functionButtons}>
                    <button onClick={() => addCommandToFunction('LEFT')} className={styles.functionBtn}>
                        <FaArrowLeft /> Esquerda
                    </button>
                    <button onClick={() => addCommandToFunction('MOVE')} className={styles.functionBtn}>
                        <FaArrowUp /> Frente
                    </button>
                    <button onClick={() => addCommandToFunction('RIGHT')} className={styles.functionBtn}>
                        <FaArrowRight /> Direita
                    </button>
                    <button onClick={() => addCommandToFunction('F0')} className={styles.functionBtn}>
                        F0
                    </button>
                    <button onClick={() => addCommandToFunction('F1')} className={styles.functionBtn}>
                        F1
                    </button>
                    <button onClick={() => addCommandToFunction('F2')} className={styles.functionBtn}>
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

                {/* Aviso de Recursão */}
                {hasRecursion && (
                    <div className={styles.recursionWarning}>
                        <FaExclamationTriangle />
                        <span>
                            <strong>Atenção:</strong> Esta função chama a si mesma (recursão). Certifique-se de ter uma condição de parada para evitar loops infinitos!
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FunctionEditor;
