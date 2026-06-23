import assert from "node:assert";
import {
    playMove,
    countPieces,
    resetGame
} from "../Othello.js";

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