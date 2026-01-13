import type { LevelConfig } from '../types/tipos';

/**
 * Configuração de todos os níveis do jogo
 * Cada nível define:
 * - id: identificador único
 * - name: nome do nível
 * - robotStart: posição inicial do robô
 * - starPosition: posição da estrela objetivo
 * - obstacles: (opcional) posições de obstáculos futuros
 */
export const LEVELS: LevelConfig[] = [
    {
        id: 1,
        name: 'Nível 1 - Primeiro Passo',
        robotStart: { x: 0, y: 0 },
        starPosition: { x: 4, y: 4 }, // Canto oposto - diagonal completa
    },
    {
        id: 2,
        name: 'Nível 2 - Desafio Intermediário',
        robotStart: { x: 0, y: 0 },
        starPosition: { x: 3, y: 2 }, // Posição intermediária diferente
    },
];

/**
 * Retorna a configuração de um nível específico
 */
export const getLevel = (levelId: number): LevelConfig | undefined => {
    return LEVELS.find(level => level.id === levelId);
};

/**
 * Retorna o número total de níveis
 */
export const getTotalLevels = (): number => {
    return LEVELS.length;
};

/**
 * Valida se uma posição de estrela é válida (não está na posição inicial do robô)
 */
export const isValidStarPosition = (
    starPos: { x: number; y: number },
    robotPos: { x: number; y: number }
): boolean => {
    return !(starPos.x === robotPos.x && starPos.y === robotPos.y);
};
