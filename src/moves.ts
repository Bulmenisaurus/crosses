import { Board } from './board';
import { Coordinate, Piece, Player } from './types';

export interface Move {
    x: number;
    y: number;
    piece: Player;
}

// If I used python I could've just used set[tuple[int, int]]... :(
const addIfUnique = (tiles: Coordinate[], coordinate: Coordinate) => {
    const alreadyContainsCoordinate = tiles.some(
        ({ x, y }) => x === coordinate.x && y === coordinate.y
    );

    if (!alreadyContainsCoordinate) {
        tiles.push(coordinate);
    }
};

export const potentialMoveSquares = (board: Board): Coordinate[] => {
    const tiles: Coordinate[] = [];
    board.pieces.forEach((p) => {
        // add each of the eight neighbors
        addIfUnique(tiles, { x: p.x + 1, y: p.y });
        addIfUnique(tiles, { x: p.x, y: p.y - 1 });
        addIfUnique(tiles, { x: p.x - 1, y: p.y });
        addIfUnique(tiles, { x: p.x, y: p.y + 1 });

        addIfUnique(tiles, { x: p.x - 1, y: p.y + 1 });
        addIfUnique(tiles, { x: p.x + 1, y: p.y + 1 });
        addIfUnique(tiles, { x: p.x + 1, y: p.y - 1 });
        addIfUnique(tiles, { x: p.x - 1, y: p.y - 1 });
    });

    return tiles.filter((tile) => board.getPiece(tile.x, tile.y) === undefined);
};

export const generateAllMoves = (board: Board, pieceColor: Player): Move[] => {
    return potentialMoveSquares(board).map((tile) => ({ x: tile.x, y: tile.y, piece: pieceColor }));
};
