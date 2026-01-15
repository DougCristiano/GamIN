/**
 * Game Types - Core type definitions for the game
 */

/** Direction the robot can face */
export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

/** Available commands that can be executed */
export type Command = 'MOVE' | 'LEFT' | 'RIGHT' | 'F0' | 'F1' | 'F2';

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
