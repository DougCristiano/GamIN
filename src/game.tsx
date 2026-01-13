import React, { useState } from 'react';
import styles from './Game.module.css';
import type { RobotState, Command } from './types/tipos.ts';
import robotImg from './assets/robot.png';
import { FaArrowLeft, FaArrowUp, FaArrowRight, FaPlay, FaUndo } from 'react-icons/fa';

const GRID_SIZE = 5;

const Game: React.FC = () => {
    const [robot, setRobot] = useState<RobotState>({ x: 0, y: 0, rotation: 90 });
    const [commandQueue, setCommandQueue] = useState<Command[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);

    // Adiciona comando à fila
    const addCommand = (cmd: Command) => {
        if (isExecuting) return;
        setCommandQueue((prev) => [...prev, cmd]);
    };

    // Limpa a fila e reseta o robô
    const reset = () => {
        setRobot({ x: 0, y: 0, rotation: 90 });
        setCommandQueue([]);
        setIsExecuting(false);
    };

    // Executa a fila com um delay entre cada passo (efeito visual)
    const runCommands = async () => {
        setIsExecuting(true);

        for (const cmd of commandQueue) {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Espera 500ms

            setRobot((prev) => {
                let { x, y, rotation } = prev;
                const angle = ((rotation % 360) + 360) % 360; // Normaliza ângulo positivo

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

                return { x, y, rotation };
            });
        }

        setIsExecuting(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.board}>
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                    <div key={i} className={styles.cell} />
                ))}
                <div
                    className={styles.robot}
                    style={{ transform: `translate(${robot.x * 60}px, ${robot.y * 60}px) rotate(${robot.rotation - 90}deg)` }}
                >
                    <img src={robotImg} alt="Robot" className={styles.robotImage} />
                </div>
            </div>

            <div className={styles.queueDisplay}>
                <strong>Fila:</strong> {commandQueue.map((c, i) => <span key={i}>{c} </span>)}
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