/**
 * Level Types - Type definitions for level configuration
 */

import type { Position } from './game.types';

/** Key with unique ID and color */
export interface KeyItem {
  id: string; // e.g., 'red', 'blue', 'green'
  position: Position;
}

/** Door with unique ID and color */
export interface DoorItem {
  id: string; // Must match a key ID to be opened
  position: Position;
}

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
  /** Optional key items with unique IDs */
  keys?: KeyItem[];
  /** Optional door items with unique IDs */
  doors?: DoorItem[];
  /** Grid size (e.g., 5 for 5x5) */
  gridSize?: number;
}

/** Level editor state */
export interface LevelEditorState {
  levels: LevelConfig[];
  selectedLevelId: number | null;
  isEditing: boolean;
}
