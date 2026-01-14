// tipos.ts
export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export type Command = 'MOVE' | 'LEFT' | 'RIGHT' | 'F0' | 'F1' | 'F2';

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
  obstacles?: Position[];
  gridSize?: number; // Tamanho do grid (ex: 5 para 5x5)
}

export interface FunctionDefinition {
  name: string;
  commands: Command[];
}