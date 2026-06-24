import R from "./ramda.js";
import {getCurrentTurn, isLegalMove} from "./Othello.js";

let keyboardMode = false;
let selectedRow = null;
let selectedCol = null;
let onPlayMove = null;
let numRows = 8;
let numCols = 8;

function getValidMoves() {
    const turn = getCurrentTurn();
    const moves = [];
    R.times(function (row) {
        R.times(function (col) {
            if (isLegalMove(row, col, turn)) {
                moves.push([row, col]);
            }
        }, numCols);
    }, numRows);
    return moves;
}

function clearSelection() {
    const cells = document.querySelectorAll(".cell.valid");
    R.forEach(function (cell) {
        cell.classList.remove("valid");
    }, Array.from(cells));
}

function highlightSelection() {
    clearSelection();
    if (selectedRow === null || selectedCol === null) {
        return;
    }
    const cell = document.querySelector(
        ".cell[data-row=\"" + selectedRow + "\"][data-col=\""
        + selectedCol + "\"]"
    );
    if (cell) {
        cell.classList.add("valid");
    }
}

function selectFirstValidMove() {
    const moves = getValidMoves();
    if (moves.length > 0) {
        selectedRow = moves[0][0];
        selectedCol = moves[0][1];
    } else {
        selectedRow = null;
        selectedCol = null;
    }
    highlightSelection();
}

function moveSelection(direction) {
    const moves = getValidMoves();
    if (moves.length === 0) {
        return;
    }
    if (selectedRow === null || selectedCol === null) {
        selectFirstValidMove();
        return;
    }

    const vectors = {
        up: [-1, 0],
        down: [1, 0],
        left: [0, -1],
        right: [0, 1]
    };
    const vector = vectors[direction];

    let candidates = R.filter(function (move) {
        const dRow = move[0] - selectedRow;
        const dCol = move[1] - selectedCol;
        if (dRow === 0 && dCol === 0) {
            return false;
        }
        const dot = dRow * vector[0] + dCol * vector[1];
        const magnitude = Math.sqrt(dRow * dRow + dCol * dCol);
        const cosAngle = dot / magnitude;
        return cosAngle > 0.5;
    }, moves);

    if (candidates.length === 0) {
        return;
    }

    candidates = R.sort(function (a, b) {
        const distA = Math.sqrt(
            (a[0] - selectedRow) ** 2 + (a[1] - selectedCol) ** 2
        );
        const distB = Math.sqrt(
            (b[0] - selectedRow) ** 2 + (b[1] - selectedCol) ** 2
        );
        return distA - distB;
    }, candidates);

    selectedRow = candidates[0][0];
    selectedCol = candidates[0][1];
    highlightSelection();
}

function handleKeydown(event) {
    if (event.key === "Tab") {
        event.preventDefault();
        keyboardMode = !keyboardMode;
        document.body.classList.toggle("keyboard-mode", keyboardMode);
        if (keyboardMode) {
            selectFirstValidMove();
        } else {
            selectedRow = null;
            selectedCol = null;
            clearSelection();
        }
        return;
    }

    if (!keyboardMode) {
        return;
    }

    if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection("up");
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection("down");
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection("left");
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection("right");
    } else if (event.key === " ") {
        event.preventDefault();
        if (selectedRow !== null && selectedCol !== null && onPlayMove) {
            onPlayMove(selectedRow, selectedCol);
            selectFirstValidMove();
        }
    }
}

function setupKeyboardControls(playMoveCallback, rows, cols) {
    onPlayMove = playMoveCallback;
    numRows = rows;
    numCols = cols;
    document.addEventListener("keydown", handleKeydown);
}

export {setupKeyboardControls};