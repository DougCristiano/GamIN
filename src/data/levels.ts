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
 * - starPositions: goal positions (stars) - can have multiple stars
 * - obstacles: (optional) wall positions
 * - gridSize: (optional) grid dimensions, defaults to 5
 */
export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Nível 1 - Primeiro Passo',
    robotStart: { x: 0, y: 0 },
    starPositions: [{ x: 4, y: 4 }],
    gridSize: 5,
  },
  {
    id: 2,
    name: 'Nível 2 - Desafio Intermediário',
    robotStart: { x: 0, y: 0 },
    starPositions: [{ x: 3, y: 2 }],
    gridSize: 5,
  },
  {
    id: 3,
    name: 'Nível 3 - Desafio Avançado',
    robotStart: { x: 0, y: 0 },
    starPositions: [{ x: 2, y: 4 }],
    gridSize: 5,
  },
  {
    id: 4,
    name: 'Nível 4 - Múltiplas Estrelas',
    robotStart: { x: 2, y: 2 },
    starPositions: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
    ],
    gridSize: 5,
  },
  {
    id: 5,
    name: 'Nível 5 - Chave e Porta',
    robotStart: { x: 0, y: 2 },
    starPositions: [{ x: 4, y: 2 }],
    keys: [{ x: 0, y: 0 }],
    doors: [{ x: 2, y: 2 }],
    obstacles: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
    ],
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
