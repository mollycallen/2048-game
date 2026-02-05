import React from "react";
import type { WinMessageProps } from "./types";

const WinMessage: React.FC<WinMessageProps> = ({
  isVisible,
  onContinue,
  onNewGame,
}) => {
  if (!isVisible) return null;

  return (
    <div className="game-message-overlay">
      <div className="game-message-modal win-message">
        <h2 className="message-title">🎉 You Win! 🎉</h2>
        <p className="message-text">Congratulations! You reached 2048!</p>
        <p className="message-subtext">
          Keep playing to improve your best score!
        </p>
        <div className="message-buttons">
          <button className="message-btn continue-btn" onClick={onContinue}>
            Continue Playing
          </button>
          <button className="message-btn new-game-btn" onClick={onNewGame}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinMessage;
