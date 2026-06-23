import assert from "node:assert";
import {
    hasLegalMove,
    resetGame
} from "../Othello.js";

describe("hasLegalMove", function () {
    beforeEach(function () {
        resetGame();
    });

    it("returns true for both colours at game start", function () {
        assert.strictEqual(hasLegalMove("black"), true);
        assert.strictEqual(hasLegalMove("white"), true);
    });
});