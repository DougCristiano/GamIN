/**
 * Services - Barrel export for all services
 */

export {
  calculateNextPosition,
  checkCollision,
  checkWin,
  executeCommand,
  expandCommands,
  normalizeRotation,
} from './gameEngine';

export type { ExpandResult } from './gameEngine';
