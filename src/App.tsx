import { useState } from 'react';
import Game from './game';
import Header from './components/Header';
import type { LevelConfig } from './types/tipos';

function App() {
  const [customLevels, setCustomLevels] = useState<LevelConfig[] | null>(null);

  const handleLevelsUpdate = (levels: LevelConfig[]) => {
    setCustomLevels(levels);
  };

  return (
    <div className="App">
      <Header onLevelsUpdate={handleLevelsUpdate} />
      <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
        <Game customLevels={customLevels} />
      </main>
    </div>
  );
}

export default App;
