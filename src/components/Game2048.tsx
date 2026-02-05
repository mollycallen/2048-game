import React, { useState, useEffect, useCallback } from "react";
import type { Board as BoardType, Direction, GameSettings } from "./types";
import Board from "./Board";
import Header from "./Header";
import Settings from "./Settings";
import Stats from "./Stats";
import WinMessage from "./WinMessage";
import GameOverMessage from "./GameOverMessage";
import ArrowButtons from "./ArrowButtons";
import {
  GRID_SIZE as DEFAULT_GRID_SIZE,
  PROBABILITY_OF_TWO as DEFAULT_PROBABILITY_OF_TWO,
  INITIAL_TILE_COUNT as DEFAULT_INITIAL_TILE_COUNT,
} from "./constants";
import { move, boardsEqual } from "./boardMovement";
import { initializeBoard, addRandomTile, checkGameState } from "./gameLogic";
import { useBestScore } from "../hooks/useBestScore";
import "./styles.css";

const DEFAULT_SETTINGS: GameSettings = {
  gridSize: DEFAULT_GRID_SIZE,
  probabilityOfTwo: DEFAULT_PROBABILITY_OF_TWO,
  initialTileCount: DEFAULT_INITIAL_TILE_COUNT,
};

const Game2048: React.FC = () => {
  // Settings state - can be modified at runtime
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // Temporary settings state (before applying)
  const [tempSettings, setTempSettings] = useState<GameSettings>(settings);

  // Game stats
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const { bestScore, updateBestScore } = useBestScore();

  // Game state
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);

  // Settings panel state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Update best score when current score changes
  useEffect(() => {
    updateBestScore(score);
  }, [score, updateBestScore]);

  // Initialize state with random tiles
  const [board, setBoard] = useState<BoardType>(() =>
    initializeBoard(
      settings.gridSize,
      settings.initialTileCount,
      settings.probabilityOfTwo
    )
  );

  // Handle any move (keyboard or button)
  const handleMove = useCallback(
    (direction: Direction): void => {
      if (!direction || isGameOver) return;

      const result = move(board, direction, settings.gridSize);

      // Only add a new tile if the board actually changed
      if (!boardsEqual(board, result.board, settings.gridSize)) {
        const boardWithNewTile = addRandomTile(
          result.board,
          settings.gridSize,
          settings.probabilityOfTwo
        );
        setBoard(boardWithNewTile);
        setMoves((prev) => prev + 1);
        setScore((prev) => prev + result.points);

        // Check game state after the move
        const gameState = checkGameState(
          boardWithNewTile,
          settings.gridSize,
          hasWon
        );

        if (gameState.shouldShowWin) {
          setHasWon(true);
          setShowWinMessage(true);
        } else if (gameState.hasWon && !hasWon) {
          setHasWon(true);
        }

        if (gameState.isGameOver) {
          setIsGameOver(true);
        }
      }
    },
    [board, settings.gridSize, settings.probabilityOfTwo, isGameOver, hasWon]
  );

  // Event handler with KeyboardEvent type
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

  // Start a new game
  const startNewGame = useCallback((): void => {
    setBoard(
      initializeBoard(
        settings.gridSize,
        settings.initialTileCount,
        settings.probabilityOfTwo
      )
    );
    setMoves(0);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
    setShowWinMessage(false);
  }, [settings]);

  // Apply settings and reset the game
  const applySettings = (): void => {
    setSettings(tempSettings);
  };

  // Open settings and sync temp settings with current settings
  const handleSettingsOpen = (): void => {
    setTempSettings(settings); // Sync temp with actual
    setIsSettingsOpen(true);
  };

  // Reset the board when settings change
  useEffect(() => {
    startNewGame();
  }, [settings, startNewGame]);

  // Set up keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup function
    return (): void => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="container">
      <div className="game-container">
        <Header
          onNewGame={startNewGame}
          onSettingsClick={handleSettingsOpen} // Fixed: now syncs temp settings
          showSettingsButton={true}
        />

        <Settings
          settings={tempSettings}
          onSettingsChange={setTempSettings}
          onApplySettings={applySettings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <Stats score={score} moves={moves} bestScore={bestScore} />

        <Board board={board} gridSize={settings.gridSize} />

        <WinMessage
          isVisible={showWinMessage}
          onContinue={() => setShowWinMessage(false)}
          onNewGame={() => {
            setShowWinMessage(false);
            startNewGame();
          }}
        />

        <GameOverMessage
          isVisible={isGameOver}
          score={score}
          moves={moves}
          bestScore={bestScore}
          onNewGame={startNewGame}
        />

        <div className="controls">
          <p className="instructions">💡 Use arrow keys or buttons to play</p>
          <ArrowButtons onMove={handleMove} disabled={isGameOver} />
        </div>
      </div>
    </div>
  );
};

export default Game2048;
