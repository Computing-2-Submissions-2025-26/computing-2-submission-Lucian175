import assert from "node:assert";
import {
    getRemaining,
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
});