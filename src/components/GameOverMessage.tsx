import React from "react";
import type { GameOverMessageProps } from "./types";

const GameOverMessage: React.FC<GameOverMessageProps> = ({
  isVisible,
  score,
  moves,
  bestScore,
  onNewGame,
}) => {
  if (!isVisible) return null;

  const isNewBestScore = score === bestScore;

  return (
    <div className="game-message-overlay">
      <div className="game-message-modal game-over-message">
        <h2 className="message-title">Game Over</h2>
        <p className="message-text">No more moves available!</p>
        <div className="final-stats">
          <div className="final-stat">
            <span className="final-stat-label">Final Score</span>
            <span className="final-stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="final-stat">
            <span className="final-stat-label">Total Moves</span>
            <span className="final-stat-value">{moves}</span>
          </div>
          {isNewBestScore && (
            <div className="final-stat best-score-achieved">
              <span className="final-stat-label">🏆 New Best Score!</span>
            </div>
          )}
        </div>
        <div className="message-buttons">
          <button className="message-btn new-game-btn" onClick={onNewGame}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverMessage;
