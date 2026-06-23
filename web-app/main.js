import {
    getBoard,
    playMove,
    hasLegalMove,
    updateStack,
    countPieces
} from "./Othello.js";
import R from "./ramda.js";

const board = document.getElementById("game-board");
const num_rows = 8;
const num_cols = 8;

function render() {
    const currentBoard = getBoard();
    const cells = document.querySelectorAll(".cell");

    Array.from(cells).forEach(function (cellElement) {
        const row = Number(cellElement.dataset.row);
        const col = Number(cellElement.dataset.col);
        const value = currentBoard[row][col];

        cellElement.innerHTML = "";

        if (value !== null) {
            const piece = document.createElement("div");
            piece.classList.add("piece", value);
            cellElement.appendChild(piece);
        }
    });

    if (!hasLegalMove("black") && !hasLegalMove("white")) {
        countPieces();
    }

    updateStack("black");
    updateStack("white");
}

function handleCellClick(row, col) {
    const moved = playMove(row, col);
    if (moved) {
        render();
    }
}

R.times(function (row) {
    R.times(function (col) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener("click", function () {
            handleCellClick(row, col);
        });
        board.appendChild(cell);
    }, num_cols);
}, num_rows);

render();