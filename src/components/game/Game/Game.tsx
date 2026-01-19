/**
 * Game Component (Refactored)
 * Main game component using custom hooks and extracted components
 */

import { useRef, useState, useEffect } from 'react';
import { FaStar, FaSquare, FaKey, FaDoorOpen } from 'react-icons/fa';
import type { LevelConfig } from '@/types';
import { getKeyColor } from '@/utils/keyColors';
import { useGame, useCommands } from '@/hooks';
import {
  FunctionEditor,
  ControlPanel,
  LevelNavigation,
  RecursionWarning,
  Timer,
  LevelHistory,
  type LevelStatus,
} from '@/components';
import robotImg from '@/assets/robot.png';
import styles from './Game.module.css';

interface GameProps {
  customLevels?: LevelConfig[] | null;
}

export const Game: React.FC<GameProps> = ({ customLevels }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(600);
  const [levelStarted, setLevelStarted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);
  const [levelStatuses, setLevelStatuses] = useState<Record<number, LevelStatus>>({});

  // Update board size on resize
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        setBoardSize(boardRef.current.offsetWidth);
      }
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  // Game state management
  const {
    currentLevel,
    currentLevelId,
    levelName,
    robot,
    starPositions,
    collectedStars,
    collectedKeys,
    totalLevels,
    isFirstLevel,
    isLastLevel,
    nextLevel,
    previousLevel,
    setCurrentLevelId,
    setRobot,
    resetLevel,
    collectStar,
    collectKey,
  } = useGame({ customLevels });

  // Command management
  const {
    commandQueue,
    functions,
    isExecuting,
    recursionWarning,
    addCommand,
    clearQueue,
    setFunctions,
    clearWarning,
    runCommands,
  } = useCommands({
    onWin: () => {
      setTimerRunning(false);
      setLevelStatuses(prev => ({ ...prev, [currentLevelId]: 'success' }));
      if (currentLevelId < totalLevels) {
        alert(`✅ ${levelName} Completado! Indo para o próximo nível...`);
        setCurrentLevelId(currentLevelId + 1);
      } else {
        alert('🎉 Parabéns! Você completou todos os níveis!');
        setCurrentLevelId(1);
      }
    },
  });

  // Reset level started state when level changes (moved after hooks)
  useEffect(() => {
    setLevelStarted(false);
    setTimerRunning(false);
    setLevelFailed(false);
  }, [currentLevelId]);

  // Handle level start
  const handleStartLevel = () => {
    setLevelStarted(true);
    if (currentLevel?.timeLimit) {
      setTimerRunning(true);
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    setTimerRunning(false);
    setLevelFailed(true);
    setLevelStatuses(prev => ({ ...prev, [currentLevelId]: 'fail' }));
    alert(`⏰ Tempo esgotado! Você não completou ${levelName}.`);
    if (currentLevelId < totalLevels) {
      setTimeout(() => {
        setCurrentLevelId(currentLevelId + 1);
      }, 1000);
    }
  };

  // Handle play button
  const handlePlay = async () => {
    if (!currentLevel) return;

    const gridSize = currentLevel.gridSize || 5;
    const obstacles = currentLevel.obstacles || [];
    const keys = currentLevel.keys || [];
    const doors = currentLevel.doors || [];

    await runCommands(
      robot,
      setRobot,
      starPositions,
      collectedStars,
      collectStar,
      collectedKeys,
      collectKey,
      gridSize,
      obstacles,
      keys,
      doors
    );
  };

  // Handle reset
  const handleReset = () => {
    resetLevel();
    clearQueue();
  };

  // Render grid cells
  const renderGrid = () => {
    if (!currentLevel) return null;

    const gridSize = currentLevel.gridSize || 5;
    const obstacles = currentLevel.obstacles || [];

    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isWall = obstacles.some(w => w.x === x && w.y === y);
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`${styles.cell} ${isWall ? styles.wall : ''}`}
            title={isWall ? 'Parede' : `Posição (${x}, ${y})`}
          >
            {isWall && <FaSquare style={{ color: '#4b5563', fontSize: '1.5em', opacity: 0.5 }} />}
          </div>
        );
      }
    }
    return cells;
  };

  const gridSize = currentLevel?.gridSize || 5;
  const cellSize = boardSize / gridSize;

  return (
    <div className={styles.container}>
      {/* Level Navigation */}
      <LevelNavigation
        levelName={levelName}
        currentLevelId={currentLevelId}
        totalLevels={totalLevels}
        onPrevious={previousLevel}
        onNext={nextLevel}
        isFirstLevel={isFirstLevel}
        isLastLevel={isLastLevel}
      />

      {/* Main Game Layout */}
      <div className={styles.gameLayout}>
        {/* Left Column - Instructions */}
        <div className={styles.instructionsPanel}>
          {/* Function Editor */}
          <FunctionEditor
            functions={functions}
            onFunctionsChange={setFunctions}
            functionLimits={currentLevel?.functionLimits}
          />

          {/* Recursion Warning */}
          {recursionWarning && (
            <RecursionWarning message={recursionWarning} onClose={clearWarning} />
          )}

          {/* Control Panel with Command Queue */}
          <ControlPanel
            onAddCommand={addCommand}
            onPlay={handlePlay}
            onReset={handleReset}
            isExecuting={isExecuting}
            hasCommands={commandQueue.length > 0}
            commandCount={commandQueue.length}
            maxCommands={currentLevel?.maxCommands}
            functionLimits={currentLevel?.functionLimits}
            commandQueue={commandQueue}
          />

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Timer - Show always if timeLimit exists */}
            {currentLevel?.timeLimit && (
              <Timer
                timeLimit={currentLevel.timeLimit}
                isRunning={timerRunning}
                onTimeUp={handleTimeUp}
              />
            )}

            {/* Start Level Button */}
            {!levelStarted && (
              <button className={styles.startLevelBtn} onClick={handleStartLevel}>
                🚀 Começar Nível
              </button>
            )}

            {/* Level History */}
            <LevelHistory
              totalLevels={totalLevels}
              levelStatuses={levelStatuses}
              currentLevelId={currentLevelId}
            />
          </div>
        </div>

        {/* Right Column - Board */}
        <div className={styles.boardPanel}>
          {/* Level Failed Message */}
          {levelFailed && (
            <div className={styles.failedMessage}>
              ⏰ Tempo esgotado! Próximo nível em breve...
            </div>
          )}

          <div
            ref={boardRef}
            className={`${styles.board} ${!levelStarted ? styles.blurred : ''}`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {renderGrid()}

            {/* Stars */}
            {starPositions.map((starPos) => {
              const starKey = `${starPos.x},${starPos.y}`;
              const isCollected = collectedStars.has(starKey);
              return (
                <div
                  key={starKey}
                  className={styles.star}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    transform: `translate(${starPos.x * cellSize}px, ${starPos.y * cellSize}px)`,
                    opacity: isCollected ? 0.3 : 1,
                    filter: isCollected ? 'grayscale(100%)' : 'none',
                  }}
                  title={isCollected ? 'Estrela coletada' : 'Estrela'}
                >
                  <FaStar />
                </div>
              );
            })}

            {/* Keys */}
            {currentLevel?.keys?.map((keyItem) => {
              const isCollected = collectedKeys.has(keyItem.id);
              const keyColor = getKeyColor(keyItem.id);
              return (
                <div
                  key={`key-${keyItem.id}`}
                  className={styles.key}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    transform: `translate(${keyItem.position.x * cellSize}px, ${keyItem.position.y * cellSize}px)`,
                    opacity: isCollected ? 0.3 : 1,
                    filter: isCollected ? 'grayscale(100%)' : 'none',
                    color: keyColor,
                  }}
                  title={isCollected ? `Chave ${keyItem.id} coletada` : `Chave ${keyItem.id}`}
                >
                  <FaKey />
                </div>
              );
            })}

            {/* Doors */}
            {currentLevel?.doors?.map((doorItem) => {
              const isOpen = collectedKeys.has(doorItem.id);
              const doorColor = getKeyColor(doorItem.id);
              return (
                <div
                  key={`door-${doorItem.id}`}
                  className={styles.door}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    transform: `translate(${doorItem.position.x * cellSize}px, ${doorItem.position.y * cellSize}px)`,
                    opacity: isOpen ? 0.5 : 1,
                    color: doorColor,
                  }}
                  title={isOpen ? `Porta ${doorItem.id} aberta` : `Porta ${doorItem.id} trancada`}
                >
                  <FaDoorOpen />
                </div>
              );
            })}

            {/* Robot */}
            <div
              className={styles.robot}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                transform: `translate(${robot.x * cellSize}px, ${robot.y * cellSize}px) rotate(${robot.rotation - 90}deg)`,
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
