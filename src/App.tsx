import React from "react";
import Game2048 from "./components/Game2048.tsx";
import "./App.css";

// TypeScript: React.FC type annotation for the App component
const App: React.FC = () => {
  return (
    <div className="App">
      <Game2048 />
    </div>
  );
};

export default App;
