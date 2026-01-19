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
    name: '1. O Início - Movimento e Funções',
    robotStart: { x: 1, y: 1 },
    starPositions: [{ x: 3, y: 3 }],
    gridSize: 5,
    maxCommands: 10,
    functionLimits: { F0: 5 },
    timeLimit: 60,
    obstacles: [
      { x: 2, y: 2 },
    ]
  },
  {
    id: 2,
    name: '2. Linha de Montagem - Recursão',
    robotStart: { x: 0, y: 2 },
    starPositions: [{ x: 4, y: 2 }],
    gridSize: 5,
    maxCommands: 5,
    functionLimits: { F0: 5 },
    obstacles: [],
    // Dica: Use recursão para chegar lá com poucos comandos
  },
  {
    id: 3,
    name: '3. Segurança Máxima - Chaves',
    robotStart: { x: 0, y: 0 },
    starPositions: [{ x: 4, y: 4 }],
    keys: [{ id: 'blue', position: { x: 4, y: 0 } }],
    doors: [{ id: 'blue', position: { x: 2, y: 2 } }],
    obstacles: [
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 2, y: 4 }, // Parede vertical com porta no meio
      { x: 0, y: 2 }, { x: 1, y: 2 }, // Bloqueio horizontal parcial
    ],
    gridSize: 5,
    maxCommands: 20,
    functionLimits: { F0: 8, F1: 8 },
  },
  {
    id: 4,
    name: '4. Piloto Automático - Condicionais',
    robotStart: { x: 0, y: 0 }, // Começa virado para Norte (padrão) -> precisa virar East
    starPositions: [{ x: 1, y: 1 }], // Perto do fim do loop
    gridSize: 6,
    coloredCells: [
      { position: { x: 5, y: 0 }, color: 'RED' }, // Canto Superior Direito
      { position: { x: 5, y: 5 }, color: 'RED' }, // Canto Inferior Direito
      { position: { x: 0, y: 5 }, color: 'RED' }, // Canto Inferior Esquerdo
      { position: { x: 0, y: 0 }, color: 'GREEN' }, // Início (opcional, só pra decorar)
    ],
    obstacles: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 2 }, { x: 4, y: 2 },
      { x: 1, y: 3 }, { x: 4, y: 3 },
      { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
    ], // Ilha central para forçar a volta externa
    maxCommands: 10,
    functionLimits: { F0: 20, F1: 10 },
    // Objetivo: Dar a volta. Se Vermelho -> Vire a Direita. F0: IF_RED RIGHT, MOVE, F0
  },
  {
    id: 5,
    name: '5. O Pintor - Memória de Estado',
    robotStart: { x: 2, y: 2 },
    // Vamos fazer um nível onde ele precisa ir e voltar.
    // Ou melhor: Pintar os cantos de uma sala.
    // Mas ele precisa coletar estrelas.
    // Vamos colocar 4 estrelas nos cantos.
    gridSize: 5,
    starPositions: [
      { x: 0, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 4 }, { x: 4, y: 4 }
    ],
    obstacles: [],
    maxCommands: 15,
    functionLimits: { F0: 20, F1: 10 },
    // Dica: Use pintura para marcar onde já foi ou mudar comportamento
  }
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
