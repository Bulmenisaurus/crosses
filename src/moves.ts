import { Board } from './board';
import { Piece, Player } from './types';

export interface Move {
    x: number;
    y: number;
    piece: Player;
}

export const generateAllMoves = (board: Board, pieceColor: Player): Move[] => {
    //!TODO
};
