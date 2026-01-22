/**
 * Level Data - Game level configurations
 */

import type { LevelConfig } from '@/types';

/**
 * Default game levels
 * Tutorial sequence:
 * 1. Basic Movement
 * 2. Conditionals (If/Else)
 * 3. Painting Mechanics
 * 4. Functions
 * 5. Recursion
 */
export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: '1. Primeiros Passos',
    robotStart: { x: 1, y: 2 },
    starPositions: [{ x: 4, y: 2 }],
    gridSize: 6,
    maxCommands: 10,
    functionLimits: {}, // Functions disabled
    obstacles: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    ],
    // Goal: Learn to Move Forward.
  },
  {
    id: 2,
    name: '2. Decisões Estratégicas',
    robotStart: { x: 1, y: 2 },
    starPositions: [{ x: 4, y: 2 }],
    gridSize: 5,
    maxCommands: 15,
    functionLimits: {}, // Functions disabled to focus on conditionals
    coloredCells: [
      { position: { x: 2, y: 2 }, color: 'GREEN' }
    ],
    obstacles: [
      { x: 3, y: 2 } // Obstacle requiring a turn
    ],
    // Goal: Use "If Green" to turn and navigate around the wall.
  },
  {
    id: 3,
    name: '3. O Pintor',
    robotStart: { x: 2, y: 2 },
    starPositions: [{ x: 0, y: 0 }, { x: 4, y: 4 }], // Reduced to 2 corners to keep it focused
    gridSize: 5,
    maxCommands: 30, // Ample moves
    functionLimits: {}, // Functions disabled
    // Goal: Practice movement and interact with the painting tool (sandbox style).
    // Hint might suggest: "Pinte células para marcar onde já passou (opcional)."
  },
  {
    id: 4,
    name: '4. Padrões Repetitivos',
    robotStart: { x: 1, y: 4 },
    starPositions: [{ x: 4, y: 1 }],
    gridSize: 6,
    maxCommands: 10,
    functionLimits: { F0: 10 }, // F0 enabled for the first time
    obstacles: [
      { x: 1, y: 3 }, { x: 2, y: 3 },
      { x: 2, y: 2 }, { x: 3, y: 2 },
      { x: 3, y: 1 }, { x: 4, y: 2 }
    ],
    // Goal: Define a pattern in F0 and call it multiple times.
  },
  {
    id: 5,
    name: '5. Loop Infinito',
    robotStart: { x: 1, y: 1 },
    starPositions: [{ x: 5, y: 1 }],
    gridSize: 7,
    maxCommands: 3,
    functionLimits: { F0: 5 }, // Needs recursion
    obstacles: [
      { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
    ],
    // Goal: Main: F0. F0: Move, F0.
  }
];

export const getLevel = (levelId: number): LevelConfig | undefined => {
  return LEVELS.find(level => level.id === levelId);
};

export const getTotalLevels = (): number => {
  return LEVELS.length;
};

export const isValidStarPosition = (
  starPos: { x: number; y: number },
  robotPos: { x: number; y: number }
): boolean => {
  return !(starPos.x === robotPos.x && starPos.y === robotPos.y);
};
