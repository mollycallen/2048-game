import { useState, useEffect } from "react";
import type { UseBestScoreReturn } from "../components/types";
const STORAGE_KEY = "2048-best-score";

/**
 * Custom hook to manage best score with localStorage persistence
 */
export const useBestScore = (): UseBestScoreReturn => {
  const [bestScore, setBestScore] = useState(0);

  // Load best score from localStorage on component mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem(STORAGE_KEY);
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, []);

  // Update best score and persist to localStorage
  const updateBestScore = (newScore: number): void => {
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem(STORAGE_KEY, newScore.toString());
    }
  };

  return { bestScore, updateBestScore };
};
