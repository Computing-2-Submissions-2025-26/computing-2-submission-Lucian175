import assert from "node:assert";
import {
    getBoard,
    getCurrentTurn,
    playMove,
    hasLegalMove,
    isLegalMove,
    getRemaining,
    countPieces,
    resetGame
} from "../Othello.js";

describe("createInitialBoard (via getBoard)", function () {
    beforeEach(function () {
        resetGame();
    });

    it("places the four starting pieces correctly", function () {
        const board = getBoard();
        assert.strictEqual(board[3][3], "white");
        assert.strictEqual(board[3][4], "black");
        assert.strictEqual(board[4][3], "black");
        assert.strictEqual(board[4][4], "white");
    });

    it("leaves all other cells empty", function () {
        const board = getBoard();
        let nonEmptyCount = 0;
        board.forEach(function (row) {
            row.forEach(function (cell) {
                if (cell !== null) {
                    nonEmptyCount += 1;
                }
            });
        });
        assert.strictEqual(nonEmptyCount, 4);
    });
});

describe("isLegalMove", function () {
    beforeEach(function () {
        resetGame();
    });

    it("rejects an occupied cell", function () {
        assert.strictEqual(isLegalMove(3, 3, "black"), false);
    });

    it("rejects a move with no flips", function () {
        assert.strictEqual(isLegalMove(0, 0, "black"), false);
    });

    it("accepts a known legal opening move for black", function () {
        assert.strictEqual(isLegalMove(2, 3, "black"), true);
    });

    it("rejects that same cell for white", function () {
        assert.strictEqual(isLegalMove(2, 3, "white"), false);
    });
});

describe("playMove", function () {
    beforeEach(function () {
        resetGame();
    });

    it("rejects an illegal move and leaves board/turn unchanged", function () {
        const turnBefore = getCurrentTurn();
        const result = playMove(0, 0);
        assert.strictEqual(result, false);
        assert.strictEqual(getCurrentTurn(), turnBefore);
    });

    it("places a piece and flips the correct opponent disc", function () {
        const result = playMove(2, 3);
        assert.strictEqual(result, true);
        const board = getBoard();
        assert.strictEqual(board[2][3], "black");
        assert.strictEqual(board[3][3], "black");
    });

    it("switches turn to white after a legal black move", function () {
        playMove(2, 3);
        assert.strictEqual(getCurrentTurn(), "white");
    });

    it("decrements only the playing colour's remaining count", function () {
        const blackBefore = getRemaining("black");
        const whiteBefore = getRemaining("white");
        playMove(2, 3);
        assert.strictEqual(getRemaining("black"), blackBefore - 1);
        assert.strictEqual(getRemaining("white"), whiteBefore);
    });

    it("does not change remaining count on an illegal move", function () {
        const blackBefore = getRemaining("black");
        playMove(0, 0);
        assert.strictEqual(getRemaining("black"), blackBefore);
    });
});

describe("hasLegalMove", function () {
    beforeEach(function () {
        resetGame();
    });

    it("returns true for both colours at game start", function () {
        assert.strictEqual(hasLegalMove("black"), true);
        assert.strictEqual(hasLegalMove("white"), true);
    });
});

describe("getRemaining", function () {
    beforeEach(function () {
        resetGame();
    });

    it("starts at 30 for both colours", function () {
        assert.strictEqual(getRemaining("black"), 30);
        assert.strictEqual(getRemaining("white"), 30);
    });
});

describe("countPieces", function () {
    beforeEach(function () {
        resetGame();
    });

    it("counts the starting position as a tie", function () {
        const result = countPieces();
        assert.strictEqual(result.black, 2);
        assert.strictEqual(result.white, 2);
        assert.strictEqual(result.winner, "tie");
    });

    it("correctly reflects a black lead after a move", function () {
        playMove(2, 3);
        const result = countPieces();
        assert.strictEqual(result.winner, "black");
    });
});