import React from "react";
import type { StatsProps } from "./types";
import "./stats.css";

const Stats: React.FC<StatsProps> = ({ score, moves, bestScore = 0 }) => {
  return (
    <div className="stats-grid-compact">
      <div className="stat-card-compact stat-score-compact">
        <div className="stat-label-compact">Score</div>
        <div className="stat-value-compact">{score.toLocaleString()}</div>
      </div>
      <div className="stat-card-compact stat-moves-compact">
        <div className="stat-label-compact">Moves</div>
        <div className="stat-value-compact">{moves}</div>
      </div>
      <div className="stat-card-compact stat-best-compact">
        <div className="stat-label-compact">Best Score</div>
        <div className="stat-value-compact">{bestScore.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default Stats;
