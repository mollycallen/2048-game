import React from "react";
import type { ArrowButtonsProps, Direction } from "./types";
import "./arrowbuttons.css";

const ArrowButtons: React.FC<ArrowButtonsProps> = ({
  onMove,
  disabled = false,
}) => {
  const handleButtonClick = (direction: Direction) => {
    if (!disabled) {
      onMove(direction);
    }
  };

  return (
    <div className="button-controls">
      <button
        className="button"
        onClick={(e) => {
          handleButtonClick("UP");
          e.currentTarget.blur();
        }}
        disabled={disabled}
      >
        ↑
      </button>
      <div className="button-row">
        <button
          className="button"
          onClick={(e) => {
            handleButtonClick("LEFT");
            e.currentTarget.blur();
          }}
          disabled={disabled}
        >
          ←
        </button>
        <button
          className="button"
          onClick={(e) => {
            handleButtonClick("DOWN");
            e.currentTarget.blur();
          }}
          disabled={disabled}
        >
          ↓
        </button>
        <button
          className="button"
          onClick={(e) => {
            handleButtonClick("RIGHT");
            e.currentTarget.blur();
          }}
          disabled={disabled}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ArrowButtons;
