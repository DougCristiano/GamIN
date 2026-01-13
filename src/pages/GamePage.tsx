import { useState, useEffect } from 'react';
import Game from '../game';
import Header from '../components/Header';
import type { LevelConfig } from '../types/tipos';

function GamePage() {
    const [customLevels, setCustomLevels] = useState<LevelConfig[] | null>(null);

    // Carrega níveis customizados do localStorage
    useEffect(() => {
        const saved = localStorage.getItem('customLevels');
        if (saved) {
            try {
                setCustomLevels(JSON.parse(saved));
            } catch (e) {
                console.error('Erro ao carregar níveis salvos:', e);
            }
        }
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
