/**
 * Level Data - Game level configurations
 */

import type { LevelConfig } from '@/types';

/**
 * Default game levels
 * Each level defines:
 * - id: unique identifier
 * - name: display name
 * - robotStart: starting position of the robot
 * - starPosition: goal position (star)
 * - obstacles: (optional) wall positions
 * - gridSize: (optional) grid dimensions, defaults to 5
 */
export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Nível 1 - Primeiro Passo',
    robotStart: { x: 0, y: 0 },
    starPosition: { x: 4, y: 4 },
    gridSize: 5,
  },
  {
    id: 2,
    name: 'Nível 2 - Desafio Intermediário',
    robotStart: { x: 0, y: 0 },
    starPosition: { x: 3, y: 2 },
    gridSize: 5,
  },
  {
    id: 3,
    name: 'Nível 3 - Desafio Avançado',
    robotStart: { x: 0, y: 0 },
    starPosition: { x: 2, y: 4 },
    gridSize: 5,
  },
];

/**
 * Get a level by its ID
 */
export const getLevel = (levelId: number): LevelConfig | undefined => {
  return LEVELS.find(level => level.id === levelId);
};

/**
 * Get total number of levels
 */
export const getTotalLevels = (): number => {
  return LEVELS.length;
};

/**
 * Validate if a star position is valid (not on robot start)
 */
export const isValidStarPosition = (
  starPos: { x: number; y: number },
  robotPos: { x: number; y: number }
): boolean => {
  return !(starPos.x === robotPos.x && starPos.y === robotPos.y);
};
