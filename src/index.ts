import { GameBoard } from './interactiveBoard';
import { renderBoard } from './render';

const main = async (mainElement: HTMLElement) => {
    const boardContainer = document.createElement('canvas');
    boardContainer.id = 'board-container';

    mainElement.appendChild(boardContainer);

    const board = new GameBoard(boardContainer);
    renderBoard(board);
};

window.addEventListener('load', () => {
    const mainElement = document.getElementsByTagName('main')[0];
    main(mainElement);
});
