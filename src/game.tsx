import React, { useState, useEffect } from 'react';
import styles from './game.module.css';
import type { RobotState, Command, LevelConfig, Position, FunctionDefinition } from './types/tipos.ts';
import robotImg from './assets/robot.png';
import { FaArrowLeft, FaArrowUp, FaArrowRight, FaPlay, FaUndo, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { LEVELS as DEFAULT_LEVELS } from './levels/levelConfig';
import FunctionEditor from './components/FunctionEditor';

const GRID_SIZE = 5;
const CELL_SIZE = 140; // Tamanho de cada célula em pixels (700px ÷ 5 = 140px)
const MAX_EXECUTION_STEPS = 1000; // Limite para evitar loops infinitos

interface GameProps {
    customLevels?: LevelConfig[] | null;
}

const Game: React.FC<GameProps> = ({ customLevels }) => {
    // Usa níveis customizados se disponíveis, senão usa os padrões
    const activeLevels = customLevels || DEFAULT_LEVELS;

    // Pega o primeiro nível para inicialização
    const initialLevel = activeLevels[0];

    const [currentLevelId, setCurrentLevelId] = useState(initialLevel.id);
    const [robot, setRobot] = useState<RobotState>({
        x: initialLevel.robotStart.x,
        y: initialLevel.robotStart.y,
        rotation: 90
    });
    const [commandQueue, setCommandQueue] = useState<Command[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [starPosition, setStarPosition] = useState<Position>({
        x: initialLevel.starPosition.x,
        y: initialLevel.starPosition.y
    });
    const [levelName, setLevelName] = useState(initialLevel.name);
    const [functions, setFunctions] = useState<FunctionDefinition[]>([
        { name: 'F0', commands: [] },
        { name: 'F1', commands: [] },
        { name: 'F2', commands: [] },
    ]);
    const [recursionWarning, setRecursionWarning] = useState<string | null>(null);

    // Carrega o nível quando muda
    useEffect(() => {
        loadLevel(currentLevelId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLevelId]);

    // Recarrega quando customLevels muda
    useEffect(() => {
        if (customLevels) {
            loadLevel(currentLevelId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customLevels]);

    const getLevel = (levelId: number): LevelConfig | undefined => {
        return activeLevels.find(level => level.id === levelId);
    };

    const loadLevel = (levelId: number) => {
        const level = getLevel(levelId);
        if (level) {
            console.log('🎮 Loading level:', level.name);
            console.log('🤖 Robot start:', level.robotStart);
            console.log('⭐ Star position:', level.starPosition);

            setRobot({
                x: level.robotStart.x,
                y: level.robotStart.y,
                rotation: 90
            });
            setStarPosition({
                x: level.starPosition.x,
                y: level.starPosition.y
            });
            setLevelName(level.name);
            setCommandQueue([]);
            setIsExecuting(false);

            console.log('✅ Level loaded successfully');
        } else {
            console.error('❌ Level not found:', levelId);
        }
    };

    // Expande funções recursivamente com proteção contra loops infinitos
    const expandCommands = (commands: Command[], depth = 0, callStack: string[] = []): Command[] => {
        // Limite de profundidade para evitar stack overflow
        if (depth > 50) {
            setRecursionWarning('⚠️ Limite de profundidade atingido (50 níveis). A execução foi interrompida para evitar travamento.');
            console.warn('⚠️ Profundidade máxima de recursão atingida (50 níveis)');
            return [];
        }

        const expanded: Command[] = [];

        for (const cmd of commands) {
            if (cmd === 'F0' || cmd === 'F1' || cmd === 'F2') {
                const func = functions.find(f => f.name === cmd);

                if (func && func.commands.length > 0) {
                    // Conta quantas vezes esta função já está na pilha de chamadas
                    const recursionCount = callStack.filter(f => f === cmd).length;

                    // Permite até 10 chamadas recursivas da mesma função
                    if (recursionCount >= 10) {
                        setRecursionWarning(`⚠️ Limite de recursão atingido para ${cmd} (10 chamadas). A função foi expandida 10 vezes e parou para evitar loop infinito.`);
                        console.warn(`⚠️ Limite de recursão atingido para ${cmd} (10 chamadas)`);
                        continue;
                    }

                    // Adiciona a função atual à pilha de chamadas
                    const newCallStack = [...callStack, cmd];
                    const subCommands = expandCommands(func.commands, depth + 1, newCallStack);
                    expanded.push(...subCommands);
                } else {
                    console.warn(`⚠️ Função ${cmd} está vazia ou não definida`);
                }
            } else {
                expanded.push(cmd);
            }
        }

        return expanded;
    };

    // Adiciona comando à fila
    const addCommand = (cmd: Command) => {
        if (isExecuting) return;
        setCommandQueue((prev) => [...prev, cmd]);
    };

    // Limpa a fila e reseta o robô para a posição inicial do nível atual
    const reset = () => {
        loadLevel(currentLevelId);
    };

    // Navega para o próximo nível
    const nextLevel = () => {
        if (currentLevelId < activeLevels.length) {
            setCurrentLevelId(currentLevelId + 1);
        }
    };

    // Navega para o nível anterior
    const previousLevel = () => {
        if (currentLevelId > 1) {
            setCurrentLevelId(currentLevelId - 1);
        }
    };

    // Executa a fila com delay
    const runCommands = async () => {
        setIsExecuting(true);
        setRecursionWarning(null); // Limpa avisos anteriores
        const level = getLevel(currentLevelId);
        if (!level) return;

        // Expande as funções
        const expandedCommands = expandCommands(commandQueue);
        console.log('📋 Comandos expandidos:', expandedCommands);

        // Proteção contra loops infinitos
        if (expandedCommands.length > MAX_EXECUTION_STEPS) {
            alert(`⚠️ Muitos comandos! Limite de ${MAX_EXECUTION_STEPS} passos excedido. Verifique se há recursão infinita.`);
            setIsExecuting(false);
            return;
        }

        let { x, y, rotation } = robot;

        for (let i = 0; i < expandedCommands.length; i++) {
            const cmd = expandedCommands[i];
            await new Promise((resolve) => setTimeout(resolve, 300)); // Velocidade de execução

            // Lógica de Movimento Local
            const angle = ((rotation % 360) + 360) % 360;

            if (cmd === 'MOVE') {
                if (angle === 0) y = Math.max(0, y - 1);
                else if (angle === 90) x = Math.min(GRID_SIZE - 1, x + 1);
                else if (angle === 180) y = Math.min(GRID_SIZE - 1, y + 1);
                else if (angle === 270) x = Math.max(0, x - 1);
            } else if (cmd === 'LEFT') {
                rotation -= 90;
            } else if (cmd === 'RIGHT') {
                rotation += 90;
            }

            // Atualiza estado visual
            setRobot({ x, y, rotation });

            // Verifica colisão com a estrela
            if (x === starPosition.x && y === starPosition.y) {
                // Pequeno delay para visualizar o robô na estrela antes do alerta
                await new Promise((resolve) => setTimeout(resolve, 200));

                const totalLevels = activeLevels.length;
                if (currentLevelId < totalLevels) {
                    alert(`✅ ${levelName} Completado! Indo para o próximo nível...`);
                    setCurrentLevelId(currentLevelId + 1);
                } else {
                    alert('🎉 Parabéns! Você completou todos os níveis!');
                    setCurrentLevelId(1); // Reinicia do primeiro nível
                }
                setIsExecuting(false);
                return;
            }
        }

        setIsExecuting(false);
    };

    return (
        <div className={styles.container}>
            {/* Título e Navegação no Topo */}
            <div className={styles.levelHeader}>
                <button
                    onClick={previousLevel}
                    disabled={currentLevelId === 1}
                    className={styles.navBtn}
                    title="Nível Anterior"
                >
                    <FaChevronLeft />
                </button>

                <div className={styles.levelInfo}>
                    <h2>{levelName}</h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                        Nível {currentLevelId} de {activeLevels.length}
                    </p>
                </div>

                <button
                    onClick={nextLevel}
                    disabled={currentLevelId === activeLevels.length}
                    className={styles.navBtn}
                    title="Próximo Nível"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Layout de Duas Colunas */}
            <div className={styles.gameLayout}>
                {/* COLUNA ESQUERDA - Instruções */}
                <div className={styles.instructionsPanel}>
                    {/* Fila de Comandos */}
                    <div className={styles.queueDisplay}>
                        <strong>Fila de Comandos:</strong>
                        {commandQueue.length === 0 ? (
                            <span style={{ color: '#999', marginLeft: '0.5rem' }}>(vazia)</span>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginLeft: '0.5rem' }}>
                                {commandQueue.map((c, i) => (
                                    <span key={i}>
                                        {c === 'MOVE' ? <FaArrowUp size={16} color="#3b82f6" /> :
                                            c === 'LEFT' ? <FaArrowLeft size={16} color="#3b82f6" /> :
                                                c === 'RIGHT' ? <FaArrowRight size={16} color="#3b82f6" /> :
                                                    <span style={{
                                                        background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        color: 'white'
                                                    }}>{c}</span>}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Aviso de Recursão/Loop Infinito */}
                    {recursionWarning && (
                        <div style={{
                            background: 'rgba(234, 179, 8, 0.15)',
                            border: '2px solid #eab308',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            color: '#fbbf24',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            animation: 'slideIn 0.3s ease-out'
                        }}>
                            <FaStar style={{ color: '#eab308', fontSize: '1.2rem' }} />
                            <div>
                                <strong>Limite de Recursão:</strong>
                                <div style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>
                                    {recursionWarning}
                                </div>
                            </div>
                            <button
                                onClick={() => setRecursionWarning(null)}
                                style={{
                                    marginLeft: 'auto',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#fbbf24',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    padding: '0.25rem'
                                }}
                                title="Fechar aviso"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Botões de Controle */}
                    <div className={styles.controls}>
                        <button onClick={() => addCommand('LEFT')}><FaArrowLeft /> Girar Esq</button>
                        <button onClick={() => addCommand('MOVE')}><FaArrowUp /> Frente</button>
                        <button onClick={() => addCommand('RIGHT')}>Girar Dir <FaArrowRight /></button>
                        <button onClick={() => addCommand('F0')} className={styles.functionCallBtn}>F0</button>
                        <button onClick={() => addCommand('F1')} className={styles.functionCallBtn}>F1</button>
                        <button onClick={() => addCommand('F2')} className={styles.functionCallBtn}>F2</button>
                        <button onClick={runCommands} disabled={isExecuting || commandQueue.length === 0} className={styles.playBtn}>
                            <FaPlay /> PLAY
                        </button>
                        <button onClick={reset} className={styles.resetBtn}><FaUndo /> Reset</button>
                    </div>

                    {/* Editor de Funções */}
                    <FunctionEditor functions={functions} onFunctionsChange={setFunctions} />
                </div>

                {/* COLUNA DIREITA - Tabuleiro */}
                <div className={styles.boardPanel}>
                    <div className={styles.board}>
                        {/* Grid */}
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                            <div key={i} className={styles.cell} />
                        ))}

                        {/* Estrela */}
                        <div
                            className={styles.star}
                            style={{
                                transform: `translate(${starPosition.x * CELL_SIZE}px, ${starPosition.y * CELL_SIZE}px)`
                            }}
                        >
                            <FaStar />
                        </div>

                        {/* Robô */}
                        <div
                            className={styles.robot}
                            style={{
                                transform: `translate(${robot.x * CELL_SIZE}px, ${robot.y * CELL_SIZE}px) rotate(${robot.rotation - 90}deg)`
                            }}
                        >
                            <img src={robotImg} alt="Robot" className={styles.robotImage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;