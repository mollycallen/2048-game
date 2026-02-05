import React from "react";
import type { SettingsProps, GameSettings } from "./types";
import {
  GRID_SIZE as DEFAULT_GRID_SIZE,
  PROBABILITY_OF_TWO as DEFAULT_PROBABILITY_OF_TWO,
  INITIAL_TILE_COUNT as DEFAULT_INITIAL_TILE_COUNT,
} from "./constants";
import "./styles.css";

const DEFAULT_SETTINGS: GameSettings = {
  gridSize: DEFAULT_GRID_SIZE,
  probabilityOfTwo: DEFAULT_PROBABILITY_OF_TWO,
  initialTileCount: DEFAULT_INITIAL_TILE_COUNT,
};

const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsChange,
  onApplySettings,
  isOpen,
  onClose,
}) => {
  // Helper function to update a single setting
  const updateSetting = (key: keyof GameSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const handleApplySettings = () => {
    onApplySettings();
    onClose();
  };

  const handleResetDefaults = () => {
    onSettingsChange(DEFAULT_SETTINGS);
  };

  return (
    <>
      {/* Sliding Settings Panel */}
      <div
        className={`settings-sliding-panel ${
          isOpen ? "settings-panel-open" : ""
        }`}
      >
        {/* Settings Header */}
        <div className="settings-sliding-header">
          <div className="settings-header-content">
            <span className="settings-icon-sliding">⚙️</span>
            <h2 className="settings-title-sliding">Game Settings</h2>
          </div>
          <button className="settings-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-sliding-content">
          {/* Grid Size Setting */}
          <div className="setting-row-sliding">
            <label className="setting-label-sliding">
              Grid Size
              <span className="setting-value-display-sliding">
                {settings.gridSize}×{settings.gridSize}
              </span>
            </label>
            <input
              id="grid-size-sliding"
              type="range"
              min="3"
              max="8"
              value={settings.gridSize}
              onChange={(e) =>
                updateSetting("gridSize", Number(e.target.value))
              }
              className="setting-range-sliding"
            />
          </div>

          {/* Starting Tiles Setting */}
          <div className="setting-row-sliding">
            <label className="setting-label-sliding">
              Starting Tiles
              <span className="setting-value-display-sliding">
                {settings.initialTileCount}
              </span>
            </label>
            <input
              id="initial-tiles-sliding"
              type="range"
              min="1"
              max="4"
              value={settings.initialTileCount}
              onChange={(e) =>
                updateSetting("initialTileCount", Number(e.target.value))
              }
              className="setting-range-sliding"
            />
          </div>

          {/* Tile Distribution Setting */}
          <div className="setting-row-sliding">
            <label className="setting-label-sliding">
              Tile Distribution
              <span className="setting-value-display-sliding">
                2: {(settings.probabilityOfTwo * 100).toFixed(0)}% | 4:{" "}
                {((1 - settings.probabilityOfTwo) * 100).toFixed(0)}%
              </span>
            </label>
            <input
              id="prob-two-sliding"
              type="range"
              min="0"
              max="100"
              step="10"
              value={settings.probabilityOfTwo * 100}
              onChange={(e) =>
                updateSetting("probabilityOfTwo", Number(e.target.value) / 100)
              }
              className="setting-range-sliding"
            />
          </div>
        </div>

        {/* Settings Footer */}
        <div className="settings-sliding-footer">
          <button
            className="settings-btn-reset-sliding"
            onClick={handleResetDefaults}
          >
            Reset Defaults
          </button>
          <button
            className="settings-btn-apply-sliding"
            onClick={handleApplySettings}
          >
            Apply & Start
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="settings-backdrop" onClick={onClose} />}
    </>
  );
};

export default Settings;
