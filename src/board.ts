import { GameBoard } from './gameBoard';
import { Move } from './moves';
import { Piece, Player, Tile } from './types';

export class Board {
    pieces: Array<Piece>;
    isFinished: boolean;
    winningPlayer: Player | undefined;
    constructor() {
        this.pieces = [];
        this.isFinished = false;
    }

    getPiece(x: number, y: number): Player | undefined {
        return this.pieces.find((p) => p.x === x && p.y === y)?.type;
    }

    setPiece(x: number, y: number, pieceColor: Player) {
        this.pieces.push({ x, y, type: pieceColor });

        if (this.is5LineThroughTile(x, y, pieceColor)) {
            this.isFinished = true;
            this.winningPlayer = pieceColor;
        }
    }

    removePiece(x: number, y: number) {
        const pieceIndex = this.pieces.findIndex((p) => p.x === x && p.y === y);

        if (pieceIndex === -1) {
            throw new Error(`Piece at ${x}, ${y} does not exists`);
        }

        this.pieces.splice(pieceIndex, 1);
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

    is5LineThroughTile(x: number, y: number, piece: Player): boolean {
        // this is terrible
        let inARow = 0;

        const check = (tx: number, ty: number) => {
            if (this.getPiece(tx, ty) == piece) {
                inARow++;
            } else {
                inARow = 0;
            }

            if (inARow == 5) {
                return true;
            }
        };

        // E-W
        for (let tx = x - 4, ty = y; tx <= x + 4; tx++) {
            if (check(tx, ty)) {
                return true;
            }
        }

        // N-S
        for (let tx = x, ty = y - 4; ty <= y + 4; ty++) {
            if (check(tx, ty)) {
                return true;
            }
        }

        // NE-SW
        for (let tx = x - 4, ty = y - 4; tx <= x + 4; tx++, ty++) {
            if (check(tx, ty)) {
                return true;
            }
        }

        // NW-SE
        for (let tx = x + 4, ty = y - 4; ty <= y + 4; tx--, ty++) {
            if (check(tx, ty)) {
                return true;
            }
        }

        return false;
    }
}
