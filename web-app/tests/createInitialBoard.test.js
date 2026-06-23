import assert from "node:assert";
import {
    getBoard,
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
        var nonEmptyCount = 0;
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
