import assert from "node:assert";
import {
    getBoard,
    getCurrentTurn,
    playMove,
    getRemaining,
    resetGame,
    setRemainingForTesting
} from "../Othello.js";
import R from "../ramda.js";

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

    it("flips discs in multiple directions from a single move", function () {
        const board = getBoard();
        R.forEach(function (r) {
            R.forEach(function (c) {
                board[r][c] = null;
            }, R.range(0, 8));
        }, R.range(0, 8));
        board[4][5] = "white";
        board[4][6] = "black";
        board[5][4] = "white";
        board[6][4] = "black";

        const result = playMove(4, 4);

        assert.strictEqual(result, true);
        assert.strictEqual(board[4][4], "black");
        assert.strictEqual(board[4][5], "black");
        assert.strictEqual(board[5][4], "black");
    });

    it("rejects a move when the player has no discs remaining", function () {
        resetGame();
        setRemainingForTesting("black", 0);
        const result = playMove(2, 3);
        assert.strictEqual(result, false);
    });
});

