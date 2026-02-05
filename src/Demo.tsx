import React, { useState, useEffect, useCallback } from "react";

// TypeScript: Define types for our data structures
type Board = number[][];
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | null;

// Game constants (now configurable)
const DEFAULT_GRID_SIZE = 4;
const DEFAULT_PROBABILITY_OF_TWO = 0.9;
const DEFAULT_INITIAL_TILE_COUNT = 2;

// TypeScript: Interface for Tile component props
interface TileProps {
  value: number;
}

// TypeScript: Interface for Board component props
interface BoardProps {
  board: Board;
  gridSize?: number;
}

// Settings interface
interface SettingsProps {
  gridSize: number;
  probabilityOfTwo: number;
  initialTileCount: number;
  onGridSizeChange: (size: number) => void;
  onProbabilityChange: (prob: number) => void;
  onInitialTileCountChange: (count: number) => void;
  onApplySettings: () => void;
}

// Header interface
interface HeaderProps {
  score: number;
  moves: number;
  onNewGame: () => void;
}

// Tile Component
const Tile: React.FC<TileProps> = ({ value }) => {
  // TypeScript: Helper function with explicit return type
  const getTileStyle = (value: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "3px",
      fontSize: value > 512 ? (value > 1024 ? "24px" : "28px") : "32px",
      fontWeight: "bold",
      transition: "all 0.15s ease-in-out",
    };

    if (value > 2048) {
      return {
        ...baseStyle,
        backgroundColor: "#3c3a32",
        color: "#f9f6f2",
        fontSize: "20px",
      };
    }

    const colorMap: { [key: number]: { bg: string; color: string } } = {
      2: { bg: "#eee4da", color: "#776e65" },
      4: { bg: "#ede0c8", color: "#776e65" },
      8: { bg: "#f2b179", color: "#f9f6f2" },
      16: { bg: "#f59563", color: "#f9f6f2" },
      32: { bg: "#f67c5f", color: "#f9f6f2" },
      64: { bg: "#f65e3b", color: "#f9f6f2" },
      128: { bg: "#edcf72", color: "#f9f6f2" },
      256: { bg: "#edcc61", color: "#f9f6f2" },
      512: { bg: "#edc850", color: "#f9f6f2" },
      1024: { bg: "#edc53f", color: "#f9f6f2" },
      2048: { bg: "#edc22e", color: "#f9f6f2" },
    };

    const colors = colorMap[value] || { bg: "#3c3a32", color: "#f9f6f2" };

    return {
      ...baseStyle,
      backgroundColor: colors.bg,
      color: colors.color,
    };
  };

  if (value === 0) return null;
  return <div style={getTileStyle(value)}>{value}</div>;
};

// Board Component
const Board: React.FC<BoardProps> = ({ board, gridSize = 4 }) => {
  const boardStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridSize}, 80px)`,
    gridTemplateRows: `repeat(${gridSize}, 80px)`,
    gap: "10px",
    backgroundColor: "#bbada0",
    padding: "10px",
    borderRadius: "6px",
  };

  const cellStyle: React.CSSProperties = {
    width: "80px",
    height: "80px",
    backgroundColor: "#cdc1b4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "3px",
  };

  return (
    <div style={boardStyle}>
      {board.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} style={cellStyle}>
            <Tile value={cellValue} />
          </div>
        ))
      )}
    </div>
  );
};

// Header Component
const Header: React.FC<HeaderProps> = ({ score, moves, onNewGame }) => {
  const headerStyle: React.CSSProperties = {
    marginBottom: "20px",
  };

  const headerRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "60px",
    fontWeight: "bold",
    color: "#776e65",
    margin: 0,
    lineHeight: 1,
  };

  const scoresContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
  };

  const scoreBoxStyle: React.CSSProperties = {
    backgroundColor: "#bbada0",
    padding: "5px 15px",
    borderRadius: "3px",
    textAlign: "center",
    minWidth: "65px",
  };

  const scoreLabelStyle: React.CSSProperties = {
    color: "#eee4da",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "2px",
  };

  const scoreValueStyle: React.CSSProperties = {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const introStyle: React.CSSProperties = {
    color: "#776e65",
    fontSize: "14px",
    margin: 0,
    flex: 1,
  };

  const newGameBtnStyle: React.CSSProperties = {
    backgroundColor: "#8f7a66",
    color: "#f9f6f2",
    border: "none",
    borderRadius: "3px",
    padding: "8px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div style={headerStyle}>
      <div style={headerRowStyle}>
        <h1 style={titleStyle}>2048</h1>
        <div style={scoresContainerStyle}>
          <div style={scoreBoxStyle}>
            <div style={scoreLabelStyle}>SCORE</div>
            <div style={scoreValueStyle}>{score}</div>
          </div>
          <div style={scoreBoxStyle}>
            <div style={scoreLabelStyle}>MOVES</div>
            <div style={scoreValueStyle}>{moves}</div>
          </div>
        </div>
      </div>
      <div style={headerRowStyle}>
        <p style={introStyle}>
          Join the tiles, get to <strong>2048!</strong>
        </p>
        <button style={newGameBtnStyle} onClick={onNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

// Settings Component using HTML5 details/summary
const Settings: React.FC<SettingsProps> = ({
  gridSize,
  probabilityOfTwo,
  initialTileCount,
  onGridSizeChange,
  onProbabilityChange,
  onInitialTileCountChange,
  onApplySettings,
}) => {
  const detailsStyle: React.CSSProperties = {
    marginBottom: "20px",
    width: "100%",
  };

  const summaryStyle: React.CSSProperties = {
    padding: "10px 15px",
    backgroundColor: "#bbada0",
    color: "#f9f6f2",
    borderRadius: "3px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    userSelect: "none",
    listStyle: "none",
  };

  const contentStyle: React.CSSProperties = {
    marginTop: "0",
    backgroundColor: "#faf8ef",
    border: "2px solid #bbada0",
    borderTop: "none",
    borderRadius: "0 0 3px 3px",
    padding: "20px",
  };

  const groupStyle: React.CSSProperties = {
    marginBottom: "25px",
  };

  const groupTitleStyle: React.CSSProperties = {
    color: "#776e65",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "15px",
    paddingBottom: "8px",
    borderBottom: "1px solid #d6cdc4",
  };

  const itemStyle: React.CSSProperties = {
    marginBottom: "20px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
  };

  const labelTextStyle: React.CSSProperties = {
    color: "#776e65",
    fontSize: "14px",
    fontWeight: 600,
    display: "block",
    marginBottom: "2px",
  };

  const descriptionStyle: React.CSSProperties = {
    color: "#a39990",
    fontSize: "11px",
    display: "block",
  };

  const controlStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const sliderStyle: React.CSSProperties = {
    flex: 1,
    height: "6px",
    backgroundColor: "#d6cdc4",
    borderRadius: "3px",
    outline: "none",
    WebkitAppearance: "none",
    appearance: "none",
  };

  const valueStyle: React.CSSProperties = {
    minWidth: "45px",
    textAlign: "right",
    color: "#776e65",
    fontWeight: "bold",
    fontSize: "14px",
  };

  const distributionStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    marginTop: "8px",
    paddingLeft: "5px",
  };

  const distributionItemStyle: React.CSSProperties = {
    color: "#a39990",
    fontSize: "12px",
    padding: "4px 8px",
    backgroundColor: "#ede0c8",
    borderRadius: "3px",
  };

  const actionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #d6cdc4",
  };

  const buttonStyle: React.CSSProperties = {
    flex: 1,
    padding: "10px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
  };

  const resetBtnStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#d6cdc4",
    color: "#776e65",
  };

  const applyBtnStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#8f7a66",
    color: "#f9f6f2",
  };

  return (
    <details style={detailsStyle}>
      <summary style={summaryStyle}>
        <span>⚙</span>
        <span style={{ flex: 1 }}>Game Options</span>
      </summary>

      <div style={contentStyle}>
        <div style={groupStyle}>
          <h4 style={groupTitleStyle}>Board Configuration</h4>

          <div style={itemStyle}>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Grid Size</span>
              <span style={descriptionStyle}>Board dimensions</span>
            </label>
            <div style={controlStyle}>
              <input
                type="range"
                min="3"
                max="8"
                value={gridSize}
                onChange={(e) => onGridSizeChange(Number(e.target.value))}
                style={sliderStyle}
              />
              <span style={valueStyle}>
                {gridSize}×{gridSize}
              </span>
            </div>
          </div>

          <div style={itemStyle}>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Starting Tiles</span>
              <span style={descriptionStyle}>Initial tile count</span>
            </label>
            <div style={controlStyle}>
              <input
                type="range"
                min="1"
                max="4"
                value={initialTileCount}
                onChange={(e) =>
                  onInitialTileCountChange(Number(e.target.value))
                }
                style={sliderStyle}
              />
              <span style={valueStyle}>{initialTileCount}</span>
            </div>
          </div>
        </div>

        <div style={groupStyle}>
          <h4 style={groupTitleStyle}>Game Mechanics</h4>

          <div style={itemStyle}>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Tile Distribution</span>
              <span style={descriptionStyle}>Chance of spawning a 2 vs 4</span>
            </label>
            <div style={controlStyle}>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={probabilityOfTwo * 100}
                onChange={(e) =>
                  onProbabilityChange(Number(e.target.value) / 100)
                }
                style={sliderStyle}
              />
              <span style={valueStyle}>
                {(probabilityOfTwo * 100).toFixed(0)}%
              </span>
            </div>
            <div style={distributionStyle}>
              <span style={distributionItemStyle}>
                2: {(probabilityOfTwo * 100).toFixed(0)}%
              </span>
              <span style={distributionItemStyle}>
                4: {((1 - probabilityOfTwo) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div style={actionsStyle}>
          <button
            style={resetBtnStyle}
            onClick={() => {
              onGridSizeChange(4);
              onProbabilityChange(0.9);
              onInitialTileCountChange(2);
            }}
          >
            Reset to Defaults
          </button>
          <button style={applyBtnStyle} onClick={onApplySettings}>
            Apply & New Game
          </button>
        </div>
      </div>
    </details>
  );
};

// Main Game Component
const Game2048: React.FC = () => {
  // Settings state - can be modified at runtime
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [probabilityOfTwo, setProbabilityOfTwo] = useState(
    DEFAULT_PROBABILITY_OF_TWO
  );
  const [initialTileCount, setInitialTileCount] = useState(
    DEFAULT_INITIAL_TILE_COUNT
  );

  // Temporary settings state (before applying)
  const [tempGridSize, setTempGridSize] = useState(gridSize);
  const [tempProbabilityOfTwo, setTempProbabilityOfTwo] =
    useState(probabilityOfTwo);
  const [tempInitialTileCount, setTempInitialTileCount] =
    useState(initialTileCount);

  // Game stats
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);

  // TypeScript: State to track the last key pressed
  const [lastKeyPressed, setLastKeyPressed] = useState<Direction>(null);

  // TypeScript: Function to create an empty board
  const createEmptyBoard = useCallback((): Board => {
    return Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(0));
  }, [gridSize]);

  // TypeScript: Helper function for adding random tile
  const addRandomTileToBoard = useCallback(
    (board: Board): Board => {
      const emptyPositions: Array<[number, number]> = [];

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (board[r][c] === 0) {
            emptyPositions.push([r, c]);
          }
        }
      }

      if (emptyPositions.length === 0) {
        return board;
      }

      const randomIndex = Math.floor(Math.random() * emptyPositions.length);
      const [row, col] = emptyPositions[randomIndex];

      const newBoard = board.map((row) => [...row]);
      // Use probability setting
      newBoard[row][col] = Math.random() < probabilityOfTwo ? 2 : 4;

      return newBoard;
    },
    [gridSize, probabilityOfTwo]
  );

  // TypeScript: Function to initialize a new game board
  const initializeBoard = useCallback((): Board => {
    let newBoard = createEmptyBoard();
    // Add initial tiles based on the setting
    for (let i = 0; i < initialTileCount; i++) {
      newBoard = addRandomTileToBoard(newBoard);
    }
    return newBoard;
  }, [createEmptyBoard, addRandomTileToBoard, initialTileCount]);

  // TypeScript: Initialize state with random tiles
  const [board, setBoard] = useState<Board>(() => initializeBoard());

  // TypeScript: Helper function to create a deep copy of the board
  const copyBoard = (board: Board): Board => {
    return board.map((row) => [...row]);
  };

  // TypeScript: Function to move and merge tiles left (base operation)
  const moveLeft = useCallback(
    (board: Board): { board: Board; points: number } => {
      const newBoard = copyBoard(board);
      let points = 0;

      for (let r = 0; r < gridSize; r++) {
        // Filter out zeros and get all non-zero tiles
        const filtered = newBoard[r].filter((val) => val !== 0);
        const merged: number[] = [];

        // Process merging from left to right
        for (let i = 0; i < filtered.length; i++) {
          if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
            // TypeScript: We know filtered[i] is a number, so doubling it is safe
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
    },
    [gridSize]
  );

  // TypeScript: Function to rotate board 90 degrees clockwise
  const rotateClockwise = useCallback(
    (board: Board): Board => {
      const newBoard: Board = Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(0));

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          newBoard[c][gridSize - 1 - r] = board[r][c];
        }
      }

      return newBoard;
    },
    [gridSize]
  );

  // TypeScript: Function to move tiles in any direction
  const move = useCallback(
    (board: Board, direction: Direction): { board: Board; points: number } => {
      if (!direction) return { board, points: 0 };

      let newBoard = copyBoard(board);
      let points = 0;

      // Transform the board so we can always use "moveLeft" logic
      switch (direction) {
        case "LEFT":
          // No transformation needed
          const leftResult = moveLeft(newBoard);
          newBoard = leftResult.board;
          points = leftResult.points;
          break;
        case "RIGHT":
          // Rotate 180°, move left, rotate back 180°
          newBoard = rotateClockwise(rotateClockwise(newBoard));
          const rightResult = moveLeft(newBoard);
          newBoard = rotateClockwise(rotateClockwise(rightResult.board));
          points = rightResult.points;
          break;
        case "UP":
          // Rotate 90° counter-clockwise (= 3 clockwise), move left, rotate back
          newBoard = rotateClockwise(
            rotateClockwise(rotateClockwise(newBoard))
          );
          const upResult = moveLeft(newBoard);
          newBoard = rotateClockwise(upResult.board);
          points = upResult.points;
          break;
        case "DOWN":
          // Rotate 90° clockwise, move left, rotate back 90° counter-clockwise
          newBoard = rotateClockwise(newBoard);
          const downResult = moveLeft(newBoard);
          newBoard = rotateClockwise(
            rotateClockwise(rotateClockwise(downResult.board))
          );
          points = downResult.points;
          break;
      }

      return { board: newBoard, points };
    },
    [moveLeft, rotateClockwise]
  );

  // TypeScript: Function to get all empty positions on the board
  const getEmptyPositions = useCallback(
    (board: Board): Array<[number, number]> => {
      const emptyPositions: Array<[number, number]> = [];

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (board[r][c] === 0) {
            emptyPositions.push([r, c]);
          }
        }
      }

      return emptyPositions;
    },
    [gridSize]
  );

  // TypeScript: Function to add a random tile to the board
  const addRandomTile = useCallback(
    (board: Board): Board => {
      const emptyPositions = getEmptyPositions(board);

      // If no empty positions, return the board unchanged
      if (emptyPositions.length === 0) {
        return board;
      }

      // Pick a random empty position
      const randomIndex = Math.floor(Math.random() * emptyPositions.length);
      const [row, col] = emptyPositions[randomIndex];

      // Create a new board with the random tile added
      const newBoard = copyBoard(board);
      // Use probability setting
      newBoard[row][col] = Math.random() < probabilityOfTwo ? 2 : 4;

      return newBoard;
    },
    [getEmptyPositions, probabilityOfTwo]
  );

  // TypeScript: Function to check if two boards are equal
  const boardsEqual = useCallback(
    (board1: Board, board2: Board): boolean => {
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (board1[r][c] !== board2[r][c]) {
            return false;
          }
        }
      }
      return true;
    },
    [gridSize]
  );

  // TypeScript: Handle any move (keyboard or button)
  const handleMove = useCallback(
    (direction: Direction): void => {
      if (!direction) return;

      setLastKeyPressed(direction);
      console.log(`Moving: ${direction}`);

      const result = move(board, direction);

      // Only add a new tile if the board actually changed
      if (!boardsEqual(board, result.board)) {
        const boardWithNewTile = addRandomTile(result.board);
        setBoard(boardWithNewTile);
        setMoves((prev) => prev + 1);
        setScore((prev) => prev + result.points);
      } else {
        // No valid move was made
        console.log("Invalid move - no tiles moved");
      }
    },
    [board, move, boardsEqual, addRandomTile]
  );

  // TypeScript: Event handler with KeyboardEvent type
  const handleKeyPress = useCallback(
    (event: KeyboardEvent): void => {
      let direction: Direction = null;

      switch (event.key) {
        case "ArrowUp":
          direction = "UP";
          event.preventDefault();
          break;
        case "ArrowDown":
          direction = "DOWN";
          event.preventDefault();
          break;
        case "ArrowLeft":
          direction = "LEFT";
          event.preventDefault();
          break;
        case "ArrowRight":
          direction = "RIGHT";
          event.preventDefault();
          break;
        default:
          return;
      }

      handleMove(direction);
    },
    [handleMove]
  );

  // TypeScript: Button click handler
  const handleButtonClick = (direction: Direction): void => {
    handleMove(direction);
  };

  // Start a new game
  const startNewGame = useCallback((): void => {
    setBoard(initializeBoard());
    setMoves(0);
    setScore(0);
  }, [initializeBoard]);

  // Apply settings and reset the game
  const applySettings = (): void => {
    setGridSize(tempGridSize);
    setProbabilityOfTwo(tempProbabilityOfTwo);
    setInitialTileCount(tempInitialTileCount);
  };

  // Reset the board when settings change
  useEffect(() => {
    startNewGame();
  }, [gridSize, initialTileCount, startNewGame]);

  // Set up keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup function
    return (): void => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#faf8ef",
    minHeight: "100vh",
  };

  const gameContainerStyle: React.CSSProperties = {
    maxWidth: "500px",
    width: "100%",
  };

  const controlsStyle: React.CSSProperties = {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  };

  const instructionsStyle: React.CSSProperties = {
    color: "#776e65",
    fontSize: "14px",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={gameContainerStyle}>
        <Header score={score} moves={moves} onNewGame={startNewGame} />

        <Settings
          gridSize={tempGridSize}
          probabilityOfTwo={tempProbabilityOfTwo}
          initialTileCount={tempInitialTileCount}
          onGridSizeChange={setTempGridSize}
          onProbabilityChange={setTempProbabilityOfTwo}
          onInitialTileCountChange={setTempInitialTileCount}
          onApplySettings={applySettings}
        />

        <Board board={board} gridSize={gridSize} />

        <div style={controlsStyle}>
          <p style={instructionsStyle}>Use arrow keys or buttons to play</p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#8f7a66",
                color: "#f9f6f2",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontWeight: "bold",
                minWidth: "50px",
              }}
              onClick={() => handleButtonClick("UP")}
            >
              ↑
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#8f7a66",
                  color: "#f9f6f2",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  minWidth: "50px",
                }}
                onClick={() => handleButtonClick("LEFT")}
              >
                ←
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#8f7a66",
                  color: "#f9f6f2",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  minWidth: "50px",
                }}
                onClick={() => handleButtonClick("DOWN")}
              >
                ↓
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#8f7a66",
                  color: "#f9f6f2",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  minWidth: "50px",
                }}
                onClick={() => handleButtonClick("RIGHT")}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game2048;
