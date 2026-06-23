import R from "./ramda.js";

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
    const newBoard = R.times(function () {
        return R.times(function () {
            return null;
        }, SIZE);
    }, SIZE);
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
        colour === "black"
        ? "white"
        : "black"
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
    R.forEach(function (direction) {
        const dRow = direction[0];
        const dCol = direction[1];
        const flips = getFlipsInDirection(row, col, colour, dRow, dCol);
        allFlips = allFlips.concat(flips);
    }, DIRECTIONS);
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
    return R.any(function (r) {
        return R.any(function (c) {
            return isLegalMove(r, c, colour);
        }, R.range(0, SIZE));
    }, R.range(0, SIZE));
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
        colour === "black"
        ? blackRemaining
        : whiteRemaining
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
    R.forEach(function (position) {
        board[position[0]][position[1]] = colour;
    }, flips);

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
function updateStack(color) {
    const stack = document.getElementById(color + "-stack");
    const top = document.getElementById(color + "-top");
    const remaining = getRemaining(color);
    const turn = getCurrentTurn();

    R.forEach(function (edge) {
        edge.remove();
    }, Array.from(stack.querySelectorAll(".disc-edge-img")));

    R.times(function () {
        const edge = document.createElement("img");
        edge.classList.add("disc-edge-img", color);
        edge.src = "./assets/disc-edge.svg";
        edge.alt = color + " disc edge";

        if (color === "black") {
            stack.insertBefore(edge, stack.firstChild);
        } else {
            stack.insertBefore(edge, top);
        }
    }, Math.max(remaining - 1, 0));

    if (remaining <= 0) {
        top.style.display = "none";
    } else {
        top.style.display = "block";
        const discFile = "./assets/disc-" + color + ".svg";
        top.src = (
            turn === color
            ? discFile
            : "./assets/disc-edge.svg"
        );
    }
}

/**
 * Displays which player won the game in the console
 * @param {*} colour
 */
function displayWinner(colour) {
    if (colour === "black") {
        console.log("black wins");
    } else if (colour === "white") {
        console.log("white wins");
    } else if (colour === "tie") {
        console.log("it's a tie");
    }
}

function showResultOverlay(src, alt) {
    try {
        const container = document.getElementById("game-result");
        if (!container) {
            return;
        }
        container.innerHTML = "";
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        container.appendChild(img);
        container.classList.remove("hidden");
    } catch (e) {
        // ignore if DOM not present (e.g., tests)
        console.debug(e);
    }
}

/**
 * Count pieces on the board and declare the winner (or tie).
 * Returns an object with the counts and the winner string.
 */
function countPieces() {
    let black = 0;
    let white = 0;

    R.times(function (r) {
        R.times(function (c) {
            if (board[r][c] === "black") {
                black += 1;
            } else if (board[r][c] === "white") {
                white += 1;
            }
        }, SIZE);
    }, SIZE);

    if (black > white) {
        displayWinner("black");
        showResultOverlay("./assets/win-black.svg", "Black wins");
        return {black: black, white: white, winner: "black"};
    } else if (white > black) {
        displayWinner("white");
        showResultOverlay("./assets/win-white.png", "White wins");
        return {black: black, white: white, winner: "white"};
    } else {
        displayWinner("tie");
        showResultOverlay("./assets/tie.svg", "Tie");
        return {black: black, white: white, winner: "tie"};
    }
}


export {
    getBoard,
    getCurrentTurn,
    playMove,
    hasLegalMove,
    getRemaining,
    updateStack,
    countPieces
};