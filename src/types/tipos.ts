// tipos.ts
export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export type Command = 'MOVE' | 'LEFT' | 'RIGHT';

export interface RobotState {
  x: number;
  y: number;
  rotation: number;
}