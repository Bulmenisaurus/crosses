import { GameBoard } from './gameBoard';
import { potentialMoveSquares } from './moves';
import { ScrollableCanvas } from './scrollableCanvas';
import { Coordinate } from './types';

const drawGridLines = (interactiveCanvas: ScrollableCanvas, ctx: CanvasRenderingContext2D) => {
    const viewPort = interactiveCanvas.getViewPort();

    // vertical lines
    const startXSnapped = Math.floor(viewPort.topLeft.x);

    for (let x = startXSnapped; x < viewPort.bottomRight.x; x += 1) {
        const startCoordGame = { x: x, y: viewPort.topLeft.y };
        const endCoordGame = { x: x, y: viewPort.bottomRight.y };

        const startCoordCanvas = interactiveCanvas.gameToCanvasCoord(
            startCoordGame.x,
            startCoordGame.y
        );
        const endCoordCanvas = interactiveCanvas.gameToCanvasCoord(endCoordGame.x, endCoordGame.y);

        ctx.beginPath();
        ctx.moveTo(startCoordCanvas.x, startCoordCanvas.y);
        ctx.lineTo(endCoordCanvas.x, endCoordCanvas.y);
        ctx.stroke();
    }

    // horizontal lines
    const startYSnapped = Math.floor(viewPort.topLeft.y);

    for (let y = startYSnapped; y < viewPort.bottomRight.y; y += 1) {
        const startCoordGame = { x: viewPort.topLeft.x, y: y };
        const endCoordGame = { x: viewPort.bottomRight.x, y: y };

        const startCoordCanvas = interactiveCanvas.gameToCanvasCoord(
            startCoordGame.x,
            startCoordGame.y
        );
        const endCoordCanvas = interactiveCanvas.gameToCanvasCoord(endCoordGame.x, endCoordGame.y);

        ctx.beginPath();
        ctx.moveTo(startCoordCanvas.x, startCoordCanvas.y);
        ctx.lineTo(endCoordCanvas.x, endCoordCanvas.y);
        ctx.stroke();
    }
};

const drawPieces = (
    board: GameBoard,
    interactiveCanvas: ScrollableCanvas,
    ctx: CanvasRenderingContext2D
) => {
    const viewPort = interactiveCanvas.getViewPort();
    // TODO: filter out pieces not in viewport
    for (const piece of board.board.pieces) {
        if (piece.type === 'cross') {
            const pieceCanvasCoord = interactiveCanvas.gameToCanvasCoord(
                piece.x + 0.2,
                piece.y + 0.2
            );
            const size = interactiveCanvas.gameToCanvasDistance(0.6);

            ctx.fillStyle = 'red';

            ctx.fillRect(pieceCanvasCoord.x, pieceCanvasCoord.y, size, size);
        } else {
            const pieceCanvasCoord = interactiveCanvas.gameToCanvasCoord(
                piece.x + 1 / 2,
                piece.y + 1 / 2
            );
            const radius = interactiveCanvas.gameToCanvasDistance((1 / 2) * (2 / 3));

            ctx.fillStyle = 'blue';

            ctx.beginPath();
            ctx.arc(pieceCanvasCoord.x, pieceCanvasCoord.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

const debugSquares = (
    interactiveCanvas: ScrollableCanvas,
    ctx: CanvasRenderingContext2D,
    squares: Coordinate[]
) => {
    for (const tile of squares) {
        const canvasCoords = interactiveCanvas.gameToCanvasCoord(tile.x, tile.y);
        const size = interactiveCanvas.gameToCanvasDistance(1);

        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(canvasCoords.x, canvasCoords.y, size, size);
    }
};

export const renderBoard = (board: GameBoard, interactiveCanvas: ScrollableCanvas) => {
    const ctx = interactiveCanvas.canvasElement.getContext('2d')!;

    ctx.clearRect(
        0,
        0,
        interactiveCanvas.canvasElement.width,
        interactiveCanvas.canvasElement.height
    );

    ctx.fillStyle = 'black';

    drawGridLines(interactiveCanvas, ctx);
    drawPieces(board, interactiveCanvas, ctx);
    debugSquares(interactiveCanvas, ctx, potentialMoveSquares(board.board));

    window.requestAnimationFrame(() => renderBoard(board, interactiveCanvas));
};
