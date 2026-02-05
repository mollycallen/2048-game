import React from "react";
import type { TileProps } from "./types";
import "./styles.css";

const Tile: React.FC<TileProps> = ({ value }) => {
  if (value === 0) return null;

  // Use 'tile-super' class for values greater than 2048
  const tileClass = value > 2048 ? "tile tile-super" : `tile tile-${value}`;

  return <div className={tileClass}>{value}</div>;
};

export default Tile;
