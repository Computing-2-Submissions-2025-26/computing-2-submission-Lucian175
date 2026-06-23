const SIZE = 8;
const DIRECTIONS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];

/**
 * Sets-up the gameboard for the start of a game.
 * @returns {array} - The board with starting pieces in place.
 */
function createInitialBoard() {
    const newBoard = Array.from({length: SIZE}, function () {
        return Array.from({length: SIZE}, function () {
            return null;
        });
    });
    newBoard[3][3] = "white";
    newBoard[3][4] = "black";
    newBoard[4][3] = "black";
    newBoard[4][4] = "white";
    return newBoard;
}

let board = createInitialBoard();
let currentTurn = "black";

function getBoard() {
    return board;
}

function getCurrentTurn() {
    return currentTurn;
}


function opponent(colour) {
    return (
        colour === "black" ? "white" : "black"
    );
}



function isOnBoard(row, col) {
    return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}


/**
 * Determines coordinates of all flippable discs along a given direction vector,
 * starting from the point where the current player's disc is set.
 * @param {*} row
 * @param {*} col
 * @param {*} colour
 * @param {*} dRow
 * @param {*} dCol
 * @returns {array} - Either empty or containg the flippable coordinates.
 */
function getFlipsInDirection(row, col, colour, dRow, dCol) {
    const flips = [];
    let r = row + dRow;
    let c = col + dCol;

    while (isOnBoard(r, c) && board[r][c] === opponent(colour)) {
        flips.push([r, c]);
        r += dRow;
        c += dCol;
    }

    if (isOnBoard(r, c) && board[r][c] === colour && flips.length > 0) {
        return flips;
    }
    return [];
}


/**
 * Returns all possible flippable disc coordinates caused by the current
 * player's placing of a disc.
 * @param {*} row
 * @param {*} col
 * @param {*} colour
 * @returns {array} - Details all possible disc flips.
 */
function getAllFlips(row, col, colour) {
    let allFlips = [];
    DIRECTIONS.forEach(function (direction) {
        const flips = getFlipsInDirection(row, col, colour, direction[0],
            direction[1]);
        allFlips = allFlips.concat(flips);
    });
    return allFlips;
}


/**
 * Checks if a disc of the given colour is able to placed at the given
 * coordinates.
 * @param {*} row
 * @param {*} col
 * @param {*} colour
 * @returns {boolean} - True if the cell is empty and there are possible flips.
 */
function isLegalMove(row, col, colour) {
    if (board[row][col] !== null) {
        return false;
    }
    return getAllFlips(row, col, colour).length > 0;
}


/**
 * Checks board to see if there are any legal moves possible for a given disc
 * colour.
 * @param {*} colour
 * @returns {boolean}
 */
function hasLegalMove(colour) {
    let found = false;
    Array.from({ length: SIZE }).forEach(function (_, row) {
        Array.from({ length: SIZE }).forEach(function (_, col) {
            if (isLegalMove(row, col, colour)) {
                found = true;
            }
        });
    });
    return found;
}



let blackRemaining = 30;
let whiteRemaining = 30;


/**
 * Returns how many discs are remaining in a player's stack.
 * @param {*} colour
 * @returns {number}
 */
function getRemaining(colour) {
    return (
        colour === "black" ? blackRemaining : whiteRemaining
    );
}


/**
 * Plays a piece in a given coordinate, provided it is a legal move.
 * @param {*} row
 * @param {*} col
 * @returns {boolean}
 */
function playMove(row, col) {
    const colour = currentTurn;

    if (!isLegalMove(row, col, colour)) {
        return false;
    }

    const flips = getAllFlips(row, col, colour);
    board[row][col] = colour;
    flips.forEach(function (position) {
        board[position[0]][position[1]] = colour;
    });

    if (colour === "black") {
        blackRemaining -= 1;
    } else {
        whiteRemaining -= 1;
    }

    const next = opponent(colour);
    if (hasLegalMove(next)) {
        currentTurn = next;
    } else if (hasLegalMove(colour)) {
        currentTurn = colour;
    }
    return true;
}


/**
 * Updates the displayed disc stack
 * @param {*} colour
 */
function updateStack(colour) {
    const stack = document.getElementById(colour + "-stack");
    const top = document.getElementById(colour + "-top");
    const remaining = getRemaining(colour);
    const turn = getCurrentTurn();

    Array.from(stack.querySelectorAll(".disc-edge")).forEach(function (edge) {
        edge.remove();
    });

    Array.from({ length: Math.max(remaining - 1, 0) }).forEach(function () {
        const edge = document.createElement("div");
        edge.classList.add("disc-edge", colour);
        stack.insertBefore(edge, top);
    });

    if (remaining <= 0) {
        top.style.display = "none";
    } else {
        top.style.display = "block";
        if (turn === colour) {
            top.classList.remove("not-active-turn");
        } else {
        top.classList.add("not-active-turn");
        }
    }
}


function countPieces() {
    //Iteartes over board and counts up pieces
}


export {getBoard, getCurrentTurn, playMove, hasLegalMove, getRemaining, updateStack};