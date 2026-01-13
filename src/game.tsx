import React, { useState, useEffect } from 'react';
import styles from './game.module.css';
import type { RobotState, Command, LevelConfig, Position } from './types/tipos.ts';
import robotImg from './assets/robot.png';
import { FaArrowLeft, FaArrowUp, FaArrowRight, FaPlay, FaUndo, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { LEVELS as DEFAULT_LEVELS } from './levels/levelConfig';

const GRID_SIZE = 5;

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
        const level = getLevel(currentLevelId);
        if (!level) return;

        let { x, y, rotation } = robot;

        for (const cmd of commandQueue) {
            await new Promise((resolve) => setTimeout(resolve, 500));

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

            <div className={styles.board}>
                {/* Grid */}
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                    <div key={i} className={styles.cell} />
                ))}

                {/* Estrela */}
                <div
                    className={styles.star}
                    style={{
                        transform: `translate(${starPosition.x * 60}px, ${starPosition.y * 60}px)`
                    }}
                >
                    <FaStar />
                </div>

                {/* Robô */}
                <div
                    className={styles.robot}
                    style={{
                        transform: `translate(${robot.x * 60}px, ${robot.y * 60}px) rotate(${robot.rotation - 90}deg)`
                    }}
                >
                    <img src={robotImg} alt="Robot" className={styles.robotImage} />
                </div>
            </div>

            <div className={styles.queueDisplay}>
                <strong>Fila de Comandos:</strong> {commandQueue.length === 0 ? (
                    <span style={{ color: '#999' }}> (vazia)</span>
                ) : (
                    commandQueue.map((c, i) => (
                        <span key={i} style={{ margin: '0 4px' }}>
                            {c === 'MOVE' ? <FaArrowUp size={12} /> :
                                c === 'LEFT' ? <FaArrowLeft size={12} /> :
                                    <FaArrowRight size={12} />}
                        </span>
                    ))
                )}
            </div>

            <div className={styles.controls}>
                <button onClick={() => addCommand('LEFT')}><FaArrowLeft /> Girar Esq</button>
                <button onClick={() => addCommand('MOVE')}><FaArrowUp /> Frente</button>
                <button onClick={() => addCommand('RIGHT')}>Girar Dir <FaArrowRight /></button>
                <button onClick={runCommands} disabled={isExecuting || commandQueue.length === 0} className={styles.playBtn}>
                    <FaPlay /> PLAY
                </button>
                <button onClick={reset} className={styles.resetBtn}><FaUndo /> Reset</button>
            </div>
        </div>
    );
};

export default Game;