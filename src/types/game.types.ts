/**
 * Game Types - Core type definitions for the game
 */

/** Direction the robot can face */
export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

/** Supported colors for painting and conditionals */
export type CellColor = 'RED' | 'GREEN' | 'BLUE';

/** Available commands that can be executed */
export type Command =
  | 'MOVE'
  | 'LEFT'
  | 'RIGHT'
  | 'F0'
  | 'F1'
  | 'F2'
  | 'PAINT_RED'
  | 'PAINT_GREEN'
  | 'PAINT_BLUE'
  | 'IF_RED'
  | 'IF_GREEN'
  | 'IF_BLUE';

/** State of the robot on the board */
export interface RobotState {
  x: number;
  y: number;
  rotation: number;
}

/** 2D position on the grid */
export interface Position {
  x: number;
  y: number;
}

/** A cell that has been painted a specific color */
export interface ColoredCell {
  position: Position;
  color: CellColor;
}

/** Function definition with its commands */
export interface FunctionDefinition {
  name: string;
  commands: Command[];
}

/** Execution state during command running */
export interface ExecutionState {
  isExecuting: boolean;
  currentStep: number;
  totalSteps: number;
  warning: string | null;
}
