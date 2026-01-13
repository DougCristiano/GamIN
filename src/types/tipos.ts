// tipos.ts
export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export type Command = 'MOVE' | 'LEFT' | 'RIGHT';

export interface RobotState {
  x: number;
  y: number;
  rotation: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  robotStart: Position;
  starPosition: Position;
  obstacles?: Position[]; // Para futuras expansões
}