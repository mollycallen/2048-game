import React from "react";
import type { HeaderProps } from "./types";
import "./header.css";

const Header: React.FC<HeaderProps> = ({
  onNewGame,
  onSettingsClick,
  showSettingsButton = false,
}) => {
  return (
    <header className="header-fixed">
      <div className="header-content">
        <div className="header-branding-compact">
          <h1 className="game-title-compact">2048</h1>
          <p className="game-tagline-compact">
            Join tiles to reach <strong>2048!</strong>
          </p>
        </div>

        <div className="header-buttons">
          {showSettingsButton && onSettingsClick && (
            <button className="settings-btn-header" onClick={onSettingsClick}>
              <span className="settings-btn-icon">⚙️</span>
              Settings
            </button>
          )}
          <button className="new-game-btn-compact" onClick={onNewGame}>
            New Game
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
