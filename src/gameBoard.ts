import { findMove } from './ai';
import { Board } from './board';
import { Move } from './moves';
import { ScrollableCanvas } from './scrollableCanvas';
import { Player, Piece, Tile, Difficulty } from './types';

export class GameBoard {
    board: Board;
    boardElement: HTMLCanvasElement;
    currentTurn: Player;
    difficulty: Difficulty;
    constructor(boardElement: HTMLCanvasElement) {
        this.board = new Board();
        this.currentTurn = 'cross';
        this.boardElement = boardElement;
        this.difficulty = 'easy';
    }

    setPiece(x: number, y: number, pieceType: Player) {
        this.board.setPiece(x, y, pieceType);
    }

    getTileColor(x: number, y: number): Tile {
        return this.board.getTileColor(x, y);
    }

    onClick(event: MouseEvent, scrollableCanvas: ScrollableCanvas) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        const { x, y } = scrollableCanvas.canvasToGameCoord(mouseX, mouseY);

        const boardTileX = Math.floor(x);
        const boardTileY = Math.floor(y);

        this.onTileClick(boardTileX, boardTileY);
    }

    onTileClick(tileX: number, tileY: number) {
        if (this.currentTurn !== 'cross') {
            console.warn('not your turn');
            return;
        }
        this.tryMove(tileX, tileY);
    }

    aiMove() {
        const move = findMove(this.board, this.currentTurn, this.difficulty);
        this.currentTurn = this.currentTurn === 'cross' ? 'circle' : 'cross';

        if (move === undefined) {
            console.warn('AI has no response, probably end of game?');
        } else {
            this.doMove(move);
        }
    }

    doMove(move: Move) {
        this.board.setPiece(move.x, move.y, move.piece);
    }

    tryMove(x: number, y: number) {
        // is there already somebody there?
        if (this.board.getPiece(x, y) !== undefined) {
            return;
        }

        this.doMove({ x, y, piece: this.currentTurn });

        // mark it as the other players turn now
        this.currentTurn = this.currentTurn === 'cross' ? 'circle' : 'cross';

        window.setTimeout(() => {
            this.aiMove();
        }, 1000);
    }
}
