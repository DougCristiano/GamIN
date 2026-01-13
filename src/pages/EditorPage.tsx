import { useNavigate } from 'react-router-dom';
import LevelEditor from '../components/LevelEditor';
import Header from '../components/Header';
import type { LevelConfig } from '../types/tipos';
import { FaArrowLeft } from 'react-icons/fa';

function EditorPage() {
    const navigate = useNavigate();

    const handleLevelsUpdate = (levels: LevelConfig[]) => {
        // Salva no localStorage para persistir entre páginas
        localStorage.setItem('customLevels', JSON.stringify(levels));
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
                        padding: '0.5rem 0'
                    }}
                >
                    <FaArrowLeft /> Voltar ao Jogo
                </button>
            </div>
            <LevelEditor
                isOpen={true}
                onClose={handleClose}
                onSave={handleLevelsUpdate}
                asPage={true}
            />
        </div>
    );
}

export default EditorPage;
