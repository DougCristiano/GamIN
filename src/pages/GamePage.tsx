import { useState, useEffect } from 'react';
import type { LevelConfig } from '@/types';
import { Header, Game } from '@/components';

function GamePage() {
  const [customLevels, setCustomLevels] = useState<LevelConfig[] | null>(null);

  // Load custom levels from localStorage
  useEffect(() => {
    const loadLevels = () => {
      const saved = localStorage.getItem('customLevels');
      if (saved) {
        try {
          setCustomLevels(JSON.parse(saved));
        } catch (e) {
          console.error('Erro ao carregar níveis salvos:', e);
        }
      }
    };

    // Carregar na montagem
    // loadLevels(); // Temporariamente desabilitado para forçar novos níveis

    // Listener para mudanças no localStorage (sincroniza entre guias)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customLevels') {
        loadLevels();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listener customizado para mudanças na mesma guia
    const handleCustomEvent = () => {
      loadLevels();
    };

    window.addEventListener('levelsUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('levelsUpdated', handleCustomEvent);
    };
  }, []);

  const handleLevelsUpdate = (levels: LevelConfig[]) => {
    setCustomLevels(levels);
    localStorage.setItem('customLevels', JSON.stringify(levels));
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

export default GamePage;
