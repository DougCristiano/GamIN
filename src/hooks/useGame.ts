/**
 * useGame Hook
 * Manages game state and level navigation
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LevelConfig, RobotState, Position } from '@/types';
import { LEVELS as DEFAULT_LEVELS } from '@/data';

interface UseGameOptions {
  customLevels?: LevelConfig[] | null;
}

interface UseGameReturn {
  // State
  currentLevel: LevelConfig | undefined;
  currentLevelId: number;
  levelName: string;
  robot: RobotState;
  starPositions: Position[];
  collectedStars: Set<string>;
  totalLevels: number;
  isFirstLevel: boolean;
  isLastLevel: boolean;

  // Actions
  loadLevel: (levelId: number) => void;
  nextLevel: () => void;
  previousLevel: () => void;
  setCurrentLevelId: (id: number) => void;
  setRobot: React.Dispatch<React.SetStateAction<RobotState>>;
  resetLevel: () => void;
  collectStar: (position: Position) => void;
}

export const useGame = (options: UseGameOptions = {}): UseGameReturn => {
  const { customLevels } = options;

  // Use custom levels if available, otherwise use defaults
  const activeLevels = useMemo(() => customLevels || DEFAULT_LEVELS, [customLevels]);

  const initialLevel = activeLevels[0];

  const [currentLevelId, setCurrentLevelId] = useState(initialLevel.id);
  const [robot, setRobot] = useState<RobotState>({
    x: initialLevel.robotStart.x,
    y: initialLevel.robotStart.y,
    rotation: 90,
  });
  const [starPositions, setStarPositions] = useState<Position[]>(
    initialLevel.starPositions || []
  );
  const [collectedStars, setCollectedStars] = useState<Set<string>>(new Set());
  const [levelName, setLevelName] = useState(initialLevel.name);

  // Get current level config
  const currentLevel = useMemo(
    () => activeLevels.find(level => level.id === currentLevelId),
    [activeLevels, currentLevelId]
  );

  // Load a level by ID
  const loadLevel = useCallback(
    (levelId: number) => {
      const level = activeLevels.find(l => l.id === levelId);
      if (level) {
        console.log('🎮 Loading level:', level.name);
        console.log('🤖 Robot start:', level.robotStart);
        console.log('⭐ Star positions:', level.starPositions);

        setRobot({
          x: level.robotStart.x,
          y: level.robotStart.y,
          rotation: 90,
        });
        setStarPositions(level.starPositions || []);
        setCollectedStars(new Set());
        setLevelName(level.name);

        console.log('✅ Level loaded successfully');
      } else {
        console.error('❌ Level not found:', levelId);
      }
    },
    [activeLevels]
  );

  // Load level when ID changes
  useEffect(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId, loadLevel]);

  // Reload when customLevels changes
  useEffect(() => {
    if (customLevels) {
      loadLevel(currentLevelId);
    }
  }, [customLevels, currentLevelId, loadLevel]);

  // Navigate to next level
  const nextLevel = useCallback(() => {
    if (currentLevelId < activeLevels.length) {
      setCurrentLevelId(currentLevelId + 1);
    }
  }, [currentLevelId, activeLevels.length]);

  // Navigate to previous level
  const previousLevel = useCallback(() => {
    if (currentLevelId > 1) {
      setCurrentLevelId(currentLevelId - 1);
    }
  }, [currentLevelId]);

  // Reset current level
  const resetLevel = useCallback(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId, loadLevel]);

  // Collect a star at the given position
  const collectStar = useCallback((position: Position) => {
    const key = `${position.x},${position.y}`;
    setCollectedStars(prev => new Set(prev).add(key));
  }, []);

  return {
    // State
    currentLevel,
    currentLevelId,
    levelName,
    robot,
    starPositions,
    collectedStars,
    totalLevels: activeLevels.length,
    isFirstLevel: currentLevelId === 1,
    isLastLevel: currentLevelId === activeLevels.length,

    // Actions
    loadLevel,
    nextLevel,
    previousLevel,
    setCurrentLevelId,
    setRobot,
    resetLevel,
    collectStar,
  };
};

export default useGame;
