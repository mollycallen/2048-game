import type { Board as BoardType } from "./types";

/**
 * Function to create an empty board
 */
export const createEmptyBoard = (gridSize: number): BoardType => {
  return Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));
};

/**
 * Function to get all empty positions on the board
 */
export const getEmptyPositions = (
  board: BoardType,
  gridSize: number
): Array<[number, number]> => {
  const emptyPositions: Array<[number, number]> = [];

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] === 0) {
        emptyPositions.push([r, c]);
      }
    }
  }

  return emptyPositions;
};

/**
 * Function to add a random tile to the board
 */
export const addRandomTile = (
  board: BoardType,
  gridSize: number,
  probabilityOfTwo: number
): BoardType => {
  const emptyPositions = getEmptyPositions(board, gridSize);

  // If no empty positions, return the board unchanged
  if (emptyPositions.length === 0) {
    return board;
  }

  // Pick a random empty position
  const randomIndex = Math.floor(Math.random() * emptyPositions.length);
  const [row, col] = emptyPositions[randomIndex];

  // Create a new board with the random tile added
  const newBoard = board.map((row) => [...row]);
  newBoard[row][col] = Math.random() < probabilityOfTwo ? 2 : 4;

  return newBoard;
};

/**
 * Function to initialize a new game board with initial tiles
 */
export const initializeBoard = (
  gridSize: number,
  initialTileCount: number,
  probabilityOfTwo: number
): BoardType => {
  let newBoard = createEmptyBoard(gridSize);

  // Add initial tiles based on the setting
  for (let i = 0; i < initialTileCount; i++) {
    newBoard = addRandomTile(newBoard, gridSize, probabilityOfTwo);
  }

  return newBoard;
};

/**
 * Function to check if the board has the winning tile (2048)
 */
export const checkForWin = (board: BoardType, gridSize: number): boolean => {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] === 2048) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Function to check if any moves are possible
 */
export const canMove = (board: BoardType, gridSize: number): boolean => {
  // Check if there are any empty cells
  if (getEmptyPositions(board, gridSize).length > 0) {
    return true;
  }

  // Check if any adjacent tiles can be merged
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const currentTile = board[r][c];

      // Check right neighbor
      if (c < gridSize - 1 && currentTile === board[r][c + 1]) {
        return true;
      }

      // Check bottom neighbor
      if (r < gridSize - 1 && currentTile === board[r + 1][c]) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Function to check game state after each move
 */
export const checkGameState = (
  board: BoardType,
  gridSize: number,
  hasWon: boolean
): {
  isGameOver: boolean;
  shouldShowWin: boolean;
  hasWon: boolean;
} => {
  // Check for win condition (only show message once)
  const boardHasWin = checkForWin(board, gridSize);
  const shouldShowWin = !hasWon && boardHasWin;

  // Check for game over condition
  const isGameOver = !canMove(board, gridSize);

  return {
    isGameOver,
    shouldShowWin,
    hasWon: hasWon || boardHasWin,
  };
};
