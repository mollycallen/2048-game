// TypeScript: Define types for our data structures
export type Board = number[][];
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | null;

export interface TileProps {
  value: number;
}

export interface BoardProps {
  board: Board;
  gridSize?: number;
}

export interface HeaderProps {
  onNewGame: () => void;
  onSettingsClick?: () => void;
  showSettingsButton?: boolean;
}
export interface StatsProps {
  score: number;
  moves: number;
  bestScore?: number;
}

export interface GameSettings {
  gridSize: number;
  probabilityOfTwo: number;
  initialTileCount: number;
}
export interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onApplySettings: () => void;
  isOpen: boolean;
  onClose: () => void;
}
export interface WinMessageProps {
  isVisible: boolean;
  onContinue: () => void;
  onNewGame: () => void;
}

export interface GameOverMessageProps {
  isVisible: boolean;
  score: number;
  moves: number;
  bestScore: number;
  onNewGame: () => void;
}
export interface ArrowButtonsProps {
  onMove: (direction: Direction) => void;
  disabled?: boolean;
}
export interface UseBestScoreReturn {
  bestScore: number;
  updateBestScore: (newScore: number) => void;
}
