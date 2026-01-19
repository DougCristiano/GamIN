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

/** Function limits configuration */
export interface FunctionLimits {
  /** Maximum commands for F0 (undefined = disabled) */
  F0?: number;
  /** Maximum commands for F1 (undefined = disabled) */
  F1?: number;
  /** Maximum commands for F2 (undefined = disabled) */
  F2?: number;
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
  /** Maximum number of commands in the main queue (undefined = unlimited) */
  maxCommands?: number;
  /** Function limits (undefined function = disabled, number = max commands) */
  functionLimits?: FunctionLimits;
}

/** Level editor state */
export interface LevelEditorState {
  levels: LevelConfig[];
  selectedLevelId: number | null;
  isEditing: boolean;
}
