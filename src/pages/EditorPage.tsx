import { useNavigate } from 'react-router-dom';
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

      <LevelEditor isOpen={true} onClose={handleClose} onSave={handleLevelsUpdate} asPage={true} />
    </div>
  );
}

export default EditorPage;
