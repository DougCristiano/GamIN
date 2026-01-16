import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import type { LevelConfig } from '@/types';
import { Header, LevelEditor } from '@/components';

function EditorPage() {
  const navigate = useNavigate();

  const handleLevelsUpdate = (levels: LevelConfig[]) => {
    // Save to localStorage to persist between pages
    localStorage.setItem('customLevels', JSON.stringify(levels));

    // Disparar evento para notificar outras guias
    window.dispatchEvent(new Event('levelsUpdated'));
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <Header hideEditorButton={true} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem 0' }}>
        <button
          onClick={handleClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: '#60a5fa',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            padding: '0.5rem 0',
          }}
        >
          <FaArrowLeft /> Voltar ao Jogo
        </button>
      </div>
      <LevelEditor isOpen={true} onClose={handleClose} onSave={handleLevelsUpdate} asPage={true} />
    </div>
  );
}

export default EditorPage;
