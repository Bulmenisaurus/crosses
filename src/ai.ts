import { Board } from './board';
import { Move, generateAllMoves } from './moves';
import { Difficulty, Piece, Player } from './types';

export const findMove = (
    board: Board,
    aiColor: Player,
    difficulty: Difficulty
): Move | undefined => {
    // TODO: check game completed

    const moveDepthSearch: number = {
        easy: 0,
        medium: 1,
        hard: 2,
    }[difficulty];

    const allMoves = generateAllMoves(board, aiColor);
    const orderedMoves = orderMoves(allMoves, aiColor);

    let bestMoves: Move[] = [];
    let bestMoveScore = -Infinity;

    const startTime = Date.now();

    for (const move of orderedMoves) {
        board.doMove(move);

        let ourScore = 0;

        // if our moves resulted in a finish, interrupt search immediately
        if (gameCompleted(board)) {
            ourScore = evaluate(board, aiColor);
        } else {
            // we just made a move, so now its time to evaluate from the perspective of the opponent

            const opponentScore = recursiveBoardSearchAlphaBeta(
                moveDepthSearch,
                board,
                aiColor === 'cross' ? 'circle' : 'cross',
                -Infinity,
                Infinity
            );

            ourScore = -opponentScore;
        }

        board.undoMove(move);

        if (ourScore > bestMoveScore) {
            bestMoveScore = ourScore;
            bestMoves = [move];
        } else if (ourScore === bestMoveScore) {
            bestMoves.push(move);
        }
    }

    const endTime = Date.now();
    console.log(`Took ${endTime - startTime}ms to evaluate positions (difficulty=${difficulty})`);

    console.log(`Choosing one of ${bestMoves.length} options`);
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
};

/**
 * Alpha beta pruning works by using really good moves to eliminate other possibilities, so if we evaluate (what we think)
 * are good moves first, it may allow alpha-beta to prune more effectively
 */
const orderMoves = (moves: Move[], playerToMove: Player) => {
    return (
        moves
            .sort((moveA, moveB) => {
                return evaluateMove(moveA, playerToMove) - evaluateMove(moveB, playerToMove);
            })
            // .sort sorts in ascending order, while we want the best moves first
            .reverse()
    );
};

const evaluateMove = (move: Move, playerToMove: Player): number => {
    // TODO
};

const recursiveBoardSearchAlphaBeta = (
    depth: number,
    board: Board,
    playerToMove: Player,
    alpha: number,
    beta: number
): number => {
    const playerFinished = gameCompleted(board);
    if (depth === 0 || playerFinished) {
        return evaluate(board, playerToMove);
    }

    const moves: Move[] = generateAllMoves(board, playerToMove);

    for (const move of moves) {
        board.doMove(move);
        const evaluation: number = -recursiveBoardSearchAlphaBeta(
            depth - 1,
            board,
            playerToMove === 'cross' ? 'circle' : 'cross',
            -beta,
            -alpha
        );
        board.undoMove(move);

        if (evaluation >= beta) {
            return beta;
        }

        alpha = Math.max(alpha, evaluation);
    }
    return alpha;
};

/**
 * Basic evaluation function.
 * Returns a:
 *  - positive value if the player who's turn it is to move is doing better
 *  - negative if the player who's turn it is to move is doing worse
 *  - 0 if it is a tie.
 */
const evaluate = (board: Board, playerToMove: Player): number => {
    // TODO
    // const whiteScore = countPlayerScore('white', board);
    // const blackScore = countPlayerScore('black', board);
    // const evaluation = whiteScore - blackScore;
    // const perspective = playerToMove === 'white' ? 1 : -1;
    // return evaluation * perspective;
};

export const countPlayerScore = (player: Piece, board: Board) => {
    // TODO: evaluation function
};

export const gameCompleted = (board: Board): boolean => {
    //TODO
};
