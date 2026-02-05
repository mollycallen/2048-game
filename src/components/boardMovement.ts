import type { Board as BoardType, Direction } from "./types";

/**
 * Helper function to create a deep copy of the board
 */
export const copyBoard = (board: BoardType): BoardType => {
  return board.map((row) => [...row]);
};

/**
 * Function to move and merge tiles left (base operation)
 * This is the core movement logic that other directions are built upon
 */
export const moveLeft = (
  board: BoardType,
  gridSize: number
): { board: BoardType; points: number } => {
  const newBoard = copyBoard(board);
  let points = 0;

  for (let r = 0; r < gridSize; r++) {
    // Filter out zeros and get all non-zero tiles
    const filtered = newBoard[r].filter((val) => val !== 0);
    const merged: number[] = [];

    // Process merging from left to right
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;
        merged.push(mergedValue);
        points += mergedValue; // Add merged value to points
        i++; // Skip the next tile since it was merged
      } else {
        merged.push(filtered[i]);
      }
    }

    // Add zeros to the right to maintain grid size tiles per row
    const missing = gridSize - merged.length;
    const zeros = Array(missing).fill(0);
    newBoard[r] = merged.concat(zeros);
  }

  return { board: newBoard, points };
};

/**
 * Function to rotate board 90 degrees clockwise
 */
export const rotateClockwise = (
  board: BoardType,
  gridSize: number
): BoardType => {
  const newBoard: BoardType = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(0));

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      newBoard[c][gridSize - 1 - r] = board[r][c];
    }
  }

  return newBoard;
};

/**
 * Function to move tiles in any direction
 * Uses rotation logic to transform any direction into a LEFT movement
 */
export const move = (
  board: BoardType,
  direction: Direction,
  gridSize: number
): { board: BoardType; points: number } => {
  if (!direction) return { board, points: 0 };

  let newBoard = copyBoard(board);
  let points = 0;

  // Transform the board so we can always use "moveLeft" logic
  switch (direction) {
    case "LEFT": {
      // No transformation needed
      const leftResult = moveLeft(newBoard, gridSize);
      newBoard = leftResult.board;
      points = leftResult.points;
      break;
    }
    case "RIGHT": {
      // Rotate 180°, move left, rotate back 180°
      newBoard = rotateClockwise(rotateClockwise(newBoard, gridSize), gridSize);
      const rightResult = moveLeft(newBoard, gridSize);
      newBoard = rotateClockwise(
        rotateClockwise(rightResult.board, gridSize),
        gridSize
      );
      points = rightResult.points;
      break;
    }
    case "UP": {
      // Rotate 90° counter-clockwise (= 3 clockwise), move left, rotate back
      newBoard = rotateClockwise(
        rotateClockwise(rotateClockwise(newBoard, gridSize), gridSize),
        gridSize
      );
      const upResult = moveLeft(newBoard, gridSize);
      newBoard = rotateClockwise(upResult.board, gridSize);
      points = upResult.points;
      break;
    }
    case "DOWN": {
      // Rotate 90° clockwise, move left, rotate back 90° counter-clockwise
      newBoard = rotateClockwise(newBoard, gridSize);
      const downResult = moveLeft(newBoard, gridSize);
      newBoard = rotateClockwise(
        rotateClockwise(rotateClockwise(downResult.board, gridSize), gridSize),
        gridSize
      );
      points = downResult.points;
      break;
    }
  }

  return { board: newBoard, points };
};

/**
 * Function to check if two boards are equal
 */
export const boardsEqual = (
  board1: BoardType,
  board2: BoardType,
  gridSize: number
): boolean => {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board1[r][c] !== board2[r][c]) {
        return false;
      }
    }
  }
  return true;
};
