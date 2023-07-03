import { GameBoard } from './gameBoard';
import { Move } from './moves';
import { Piece, Player, Tile } from './types';

export class Board {
    pieces: Array<Piece>;
    constructor() {
        this.pieces = [
            { x: 1, y: 1, type: 'circle' },
            { x: 0, y: 0, type: 'cross' },
        ];
    }

    getPiece(x: number, y: number): Player | undefined {
        return this.pieces.find((p) => p.x === x && p.y === y)?.type;
    }

    setPiece(x: number, y: number, piece: Player) {
        this.pieces.push({ x, y, type: piece });
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
