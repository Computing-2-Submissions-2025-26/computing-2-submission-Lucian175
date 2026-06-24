import assert from "node:assert";
import {
    getRemaining,
    playMove,
    resetGame
} from "../Othello.js";

describe("getRemaining", function () {
    beforeEach(function () {
        resetGame();
    });

    it("starts at 30 for both colours", function () {
        assert.strictEqual(getRemaining("black"), 30);
        assert.strictEqual(getRemaining("white"), 30);
    });

    it("decreases by exactly one after a legal move", function () {
        const before = getRemaining("black");
        playMove(2, 3);
        const after = getRemaining("black");
        assert.strictEqual(after, before - 1);
    });
});