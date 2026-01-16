/**
 * Level Types - Type definitions for level configuration
 */

import type { Position } from './game.types';

/** Configuration for a game level */
export interface LevelConfig {
  /** Unique identifier for the level */
  id: number;
  /** Display name of the level */
  name: string;
  /** Starting position of the robot */
  robotStart: Position;
  /** Positions of the stars (goals) - supports multiple stars */
  starPositions: Position[];
  /** Optional obstacle positions */
  obstacles?: Position[];
  /** Grid size (e.g., 5 for 5x5) */
  gridSize?: number;
}

/** Level editor state */
export interface LevelEditorState {
  levels: LevelConfig[];
  selectedLevelId: number | null;
  isEditing: boolean;
}
