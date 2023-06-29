import { GameBoard } from './gameBoard';

export const renderBoard = (board: GameBoard) => {
    window.requestAnimationFrame(() => renderBoard(board));
};
