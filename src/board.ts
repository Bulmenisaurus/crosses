import { GameBoard } from './interactiveBoard';
import { Move } from './moves';
import { Piece, Player, Tile } from './types';

export class Board {
    pieces: Array<Piece>;
    constructor() {
        this.pieces = [];
    }

    getPiece(x: number, y: number): Player {
        //!TODO
    }

    setPiece(x: number, y: number, piece: Player) {
        //!TODO
    }

    removePiece(x: number, y: number) {
        //!TODO
    }

    getTileColor(x: number, y: number): Tile {
        return (<Tile[]>['white', 'black'])[(x + y) % 2];
    }

    doMove(move: Move) {
        this.setPiece(move.x, move.y, move.piece);
    }

    undoMove(move: Move) {
        this.removePiece(move.x, move.y);
    }
}
