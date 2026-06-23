import assert from "node:assert";
import {
    isLegalMove,
    resetGame
} from "../Othello.js";

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