export type Player = 'circle' | 'cross';
export type Coordinate = { x: number; y: number };
export type Piece = Coordinate & { type: Player };
export type Tile = 'black' | 'white';

export type Difficulty = 'easy' | 'medium' | 'hard';
