/**
 * Game Engine Service
 * Pure business logic for the game - no React dependencies
 */

import type { Position, Command, FunctionDefinition, RobotState } from '@/types';
import { MAX_RECURSION_DEPTH, MAX_FUNCTION_CALLS } from '@/utils/constants';

/**
 * Calculate next position based on current position and rotation
 */
export const calculateNextPosition = (
  current: Position,
  rotation: number,
  gridSize: number
): Position => {
  const angle = ((rotation % 360) + 360) % 360;
  let nextX = current.x;
  let nextY = current.y;

  if (angle === 0) nextY = Math.max(0, current.y - 1);
  else if (angle === 90) nextX = Math.min(gridSize - 1, current.x + 1);
  else if (angle === 180) nextY = Math.min(gridSize - 1, current.y + 1);
  else if (angle === 270) nextX = Math.max(0, current.x - 1);

  return { x: nextX, y: nextY };
};

/**
 * Check if a position collides with an obstacle
 */
export const checkCollision = (position: Position, obstacles: Position[]): boolean => {
  return obstacles.some(obs => obs.x === position.x && obs.y === position.y);
};

/**
 * Check if robot reached the star (win condition)
 */
export const checkWin = (robotPosition: Position, starPosition: Position): boolean => {
  return robotPosition.x === starPosition.x && robotPosition.y === starPosition.y;
};

/**
 * Execute a single command and return the new robot state
 */
export const executeCommand = (
  robotState: RobotState,
  command: Command,
  gridSize: number,
  obstacles: Position[]
): RobotState => {
  const { x, y, rotation } = robotState;

  switch (command) {
    case 'MOVE': {
      const nextPosition = calculateNextPosition({ x, y }, rotation, gridSize);
      const hasCollision = checkCollision(nextPosition, obstacles);
      if (!hasCollision) {
        return { ...robotState, x: nextPosition.x, y: nextPosition.y };
      }
      return robotState; // Stay in place if collision
    }
    case 'LEFT':
      return { ...robotState, rotation: rotation - 90 };
    case 'RIGHT':
      return { ...robotState, rotation: rotation + 90 };
    default:
      return robotState;
  }
};

/**
 * Result of command expansion
 */
export interface ExpandResult {
  commands: Command[];
  warning: string | null;
}

/**
 * Expand function calls into basic commands recursively
 */
export const expandCommands = (
  commands: Command[],
  functions: FunctionDefinition[],
  depth = 0,
  callStack: string[] = []
): ExpandResult => {
  // Depth limit to prevent stack overflow
  if (depth > MAX_RECURSION_DEPTH) {
    return {
      commands: [],
      warning: `⚠️ Limite de profundidade atingido (${MAX_RECURSION_DEPTH} níveis). A execução foi interrompida para evitar travamento.`,
    };
  }

  const expanded: Command[] = [];
  let warning: string | null = null;

  for (const cmd of commands) {
    if (cmd === 'F0' || cmd === 'F1' || cmd === 'F2') {
      const func = functions.find(f => f.name === cmd);

      if (func && func.commands.length > 0) {
        // Count how many times this function is already in the call stack
        const recursionCount = callStack.filter(f => f === cmd).length;

        // Allow up to MAX_FUNCTION_CALLS recursive calls per function
        if (recursionCount >= MAX_FUNCTION_CALLS) {
          warning = `⚠️ Limite de recursão atingido para ${cmd} (${MAX_FUNCTION_CALLS} chamadas). A função foi expandida ${MAX_FUNCTION_CALLS} vezes e parou para evitar loop infinito.`;
          continue;
        }

        // Add current function to call stack
        const newCallStack = [...callStack, cmd];
        const subResult = expandCommands(func.commands, functions, depth + 1, newCallStack);
        expanded.push(...subResult.commands);

        if (subResult.warning) {
          warning = subResult.warning;
        }
      }
    } else {
      expanded.push(cmd);
    }
  }

  return { commands: expanded, warning };
};

/**
 * Normalize rotation angle to 0-360 range
 */
export const normalizeRotation = (rotation: number): number => {
  return ((rotation % 360) + 360) % 360;
};
