"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/moves.ts
  var generateAllMoves;
  var init_moves = __esm({
    "src/moves.ts"() {
      "use strict";
      generateAllMoves = (board, pieceColor) => {
      };
    }
  });

  // src/ai.ts
  var findMove, orderMoves, evaluateMove, recursiveBoardSearchAlphaBeta, evaluate, gameCompleted;
  var init_ai = __esm({
    "src/ai.ts"() {
      "use strict";
      init_moves();
      findMove = (board, aiColor, difficulty) => {
        const moveDepthSearch = {
          easy: 0,
          medium: 1,
          hard: 2
        }[difficulty];
        const allMoves = generateAllMoves(board, aiColor);
        const orderedMoves = orderMoves(allMoves, aiColor);
        let bestMoves = [];
        let bestMoveScore = -Infinity;
        const startTime = Date.now();
        for (const move of orderedMoves) {
          board.doMove(move);
          let ourScore = 0;
          if (gameCompleted(board)) {
            ourScore = evaluate(board, aiColor);
          } else {
            const opponentScore = recursiveBoardSearchAlphaBeta(
              moveDepthSearch,
              board,
              aiColor === "cross" ? "circle" : "cross",
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
      orderMoves = (moves, playerToMove) => {
        return moves.sort((moveA, moveB) => {
          return evaluateMove(moveA, playerToMove) - evaluateMove(moveB, playerToMove);
        }).reverse();
      };
      evaluateMove = (move, playerToMove) => {
      };
      recursiveBoardSearchAlphaBeta = (depth, board, playerToMove, alpha, beta) => {
        const playerFinished = gameCompleted(board);
        if (depth === 0 || playerFinished) {
          return evaluate(board, playerToMove);
        }
        const moves = generateAllMoves(board, playerToMove);
        for (const move of moves) {
          board.doMove(move);
          const evaluation = -recursiveBoardSearchAlphaBeta(
            depth - 1,
            board,
            playerToMove === "cross" ? "circle" : "cross",
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
      evaluate = (board, playerToMove) => {
      };
      gameCompleted = (board) => {
      };
    }
  });

  // src/board.ts
  var Board;
  var init_board = __esm({
    "src/board.ts"() {
      "use strict";
      Board = class {
        constructor() {
          this.pieces = [];
        }
        getPiece(x, y) {
        }
        setPiece(x, y, piece) {
        }
        removePiece(x, y) {
        }
        getTileColor(x, y) {
          return ["white", "black"][(x + y) % 2];
        }
        doMove(move) {
          this.setPiece(move.x, move.y, move.piece);
        }
        undoMove(move) {
          this.removePiece(move.x, move.y);
        }
      };
    }
  });

  // src/interactiveBoard.ts
  var GameBoard;
  var init_interactiveBoard = __esm({
    "src/interactiveBoard.ts"() {
      "use strict";
      init_ai();
      init_board();
      GameBoard = class {
        constructor(boardElement) {
          this.board = new Board();
          this.currentTurn = "cross";
          this.boardElement = boardElement;
          this.difficulty = "easy";
          boardElement.addEventListener("click", (ev) => {
            this.onClick(ev);
          });
        }
        setPiece(x, y, pieceType) {
          this.board.setPiece(x, y, pieceType);
        }
        getTileColor(x, y) {
          return this.board.getTileColor(x, y);
        }
        onClick(event) {
          const mouseX = event.offsetX;
          const mouseY = event.offsetY;
          const boardFractionX = mouseX / this.boardElement.getBoundingClientRect().width;
          const boardFractionY = mouseY / this.boardElement.getBoundingClientRect().height;
          this.onTileClick();
        }
        onTileClick(tileX, tileY) {
          this.tryMove(tileX, tileY);
        }
        aiMove() {
          const move = findMove(this.board, this.currentTurn, this.difficulty);
          this.currentTurn = this.currentTurn === "cross" ? "circle" : "cross";
          if (move === void 0) {
            console.warn("AI has no response, probably end of game?");
          } else {
            this.doMove(move);
          }
        }
        doMove(move) {
          this.board.setPiece(move.x, move.y, move.piece);
        }
        tryMove(x, y) {
          this.doMove({ x, y, piece: this.currentTurn });
          this.currentTurn = this.currentTurn === "cross" ? "circle" : "cross";
          window.setTimeout(() => {
            this.aiMove();
          }, 1e3);
        }
      };
    }
  });

  // src/render.ts
  var renderBoard;
  var init_render = __esm({
    "src/render.ts"() {
      "use strict";
      renderBoard = (board) => {
      };
    }
  });

  // src/index.ts
  var require_src = __commonJS({
    "src/index.ts"(exports) {
      init_interactiveBoard();
      init_render();
      var main = (mainElement) => __async(exports, null, function* () {
        const boardContainer = document.createElement("canvas");
        boardContainer.id = "board-container";
        mainElement.appendChild(boardContainer);
        const board = new GameBoard(boardContainer);
        renderBoard(board);
      });
      window.addEventListener("load", () => {
        const mainElement = document.getElementsByTagName("main")[0];
        main(mainElement);
      });
    }
  });
  require_src();
})();
//!TODO
