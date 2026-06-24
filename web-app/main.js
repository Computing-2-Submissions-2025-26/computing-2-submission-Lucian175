import {
    getBoard,
    playMove,
    hasLegalMove,
    updateStack,
    isLegalMove,
    getCurrentTurn,
    countPieces
} from "./Othello.js";
import {setupKeyboardControls} from "./keyboard.js";
import R from "./ramda.js";

const board = document.getElementById("game-board");
const num_rows = 8;
const num_cols = 8;
document.documentElement.style.setProperty("--num-rows", num_rows);
document.documentElement.style.setProperty("--num-cols", num_cols);

function render() {
    const currentBoard = getBoard();
    const cells = document.querySelectorAll(".cell");
    R.forEach(function (cellElement) {
        const row = Number(cellElement.dataset.row);
        const col = Number(cellElement.dataset.col);
        const value = currentBoard[row][col];
        cellElement.innerHTML = "";
        if (value !== null) {
            const piece = document.createElement("img");
            piece.classList.add("piece", value);
            piece.src = "./assets/disc-" + value + ".svg";
            piece.alt = value + " piece";
            cellElement.appendChild(piece);
        }
    }, Array.from(cells));
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
        cell.addEventListener("mouseenter", function () {
            const turn = getCurrentTurn();
            if (isLegalMove(row, col, turn)) {
                cell.classList.add("valid");
            }
        });
        cell.addEventListener("mouseleave", function () {
            cell.classList.remove("valid");
        });
        board.appendChild(cell);
    }, num_cols);
}, num_rows);

setupKeyboardControls(handleCellClick, num_rows, num_cols);

render();