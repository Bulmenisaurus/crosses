import { findMove } from './ai';
import { Board } from './board';
import { Move } from './moves';
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

        boardElement.addEventListener('click', (ev) => {
            this.onClick(ev);
        });
    }

    setPiece(x: number, y: number, pieceType: Player) {
        this.board.setPiece(x, y, pieceType);
    }

    getTileColor(x: number, y: number): Tile {
        return this.board.getTileColor(x, y);
    }

    onClick(event: MouseEvent) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        const boardFractionX = mouseX / this.boardElement.getBoundingClientRect().width;
        const boardFractionY = mouseY / this.boardElement.getBoundingClientRect().height;

        // TODO: calculate the actual tile that was clicked

        // const boardTileX = Math.floor(boardFractionX * 8);
        // const boardTileY = Math.floor(boardFractionY * 8);

        this.onTileClick();
    }

    onTileClick(tileX: number, tileY: number) {
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
        //TODO: validate move

        this.doMove({ x, y, piece: this.currentTurn });

        // mark it as the other players turn now
        this.currentTurn = this.currentTurn === 'cross' ? 'circle' : 'cross';

        window.setTimeout(() => {
            this.aiMove();
        }, 1000);
    }
}
