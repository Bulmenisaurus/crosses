import { GameBoard } from './gameBoard';
import { renderBoard } from './render';
import { ScrollableCanvas } from './scrollableCanvas';

const main = async (mainElement: HTMLElement) => {
    const boardContainer = document.createElement('canvas');
    boardContainer.id = 'board-container';

    mainElement.appendChild(boardContainer);

    const board = new GameBoard(boardContainer);
    const interactiveCanvas = new ScrollableCanvas(boardContainer);

    // TODO: prevent clicking when scrolling

    interactiveCanvas.clickEvent.subscribe((e) => {
        board.onClick(e, interactiveCanvas);
    });

    renderBoard(board, interactiveCanvas);
};

window.addEventListener('load', () => {
    const mainElement = document.getElementsByTagName('main')[0];
    main(mainElement);
});
