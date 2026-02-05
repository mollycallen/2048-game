import React from "react";
import type { BoardProps } from "./types";
import Tile from "./Tile";
import "./styles.css";

const Board: React.FC<BoardProps> = ({ board, gridSize = 4 }) => {
  // Dynamic board style based on grid size
  const boardStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridSize}, 80px)`,
    gridTemplateRows: `repeat(${gridSize}, 80px)`,
    gap: "10px",
    backgroundColor: "#bbada0",
    padding: "10px",
    borderRadius: "6px",
    width: "fit-content",
    margin: "0 auto",
  };

  return (
    <div className="board" style={boardStyle}>
      {board.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="cell">
            <Tile value={cellValue} />
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
