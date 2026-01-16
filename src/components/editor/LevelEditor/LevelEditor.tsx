import { useState, useEffect } from 'react';
import { FaTimes, FaRobot, FaStar, FaSave, FaPlus, FaTrash, FaSquare, FaKey, FaDoorOpen } from 'react-icons/fa';
import type { LevelConfig } from '@/types';
import { LEVELS } from '@/data';
import styles from './LevelEditor.module.css';

interface LevelEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (levels: LevelConfig[]) => void;
  asPage?: boolean;
}

type EditorMode = 'robot' | 'star' | 'wall' | 'key' | 'door';

const LevelEditor: React.FC<LevelEditorProps> = ({ isOpen, onClose, onSave, asPage = false }) => {
  // Carregar níveis salvos do localStorage ou usar níveis padrão
  const [levels, setLevels] = useState<LevelConfig[]>(() => {
    const savedLevels = localStorage.getItem('customLevels');
    if (savedLevels) {
      try {
        return JSON.parse(savedLevels);
      } catch (e) {
        console.error('Erro ao carregar níveis salvos:', e);
        return [...LEVELS];
      }
    }
    return [...LEVELS];
  });
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('robot');
  const [levelName, setLevelName] = useState('');

  useEffect(() => {
    if (selectedLevelId) {
      const level = levels.find(l => l.id === selectedLevelId);
      if (level) {
        setCurrentLevel({
          ...level,
          obstacles: level.obstacles || [],
          keys: level.keys || [],
          doors: level.doors || [],
          gridSize: level.gridSize || 5,
        });
        setLevelName(level.name);
      }
    }
  }, [selectedLevelId, levels]);

  if (!isOpen) return null;

  const handleCellClick = (x: number, y: number) => {
    if (!currentLevel) return;

    const updatedLevel = { ...currentLevel };
    const walls = updatedLevel.obstacles || [];
    const stars = updatedLevel.starPositions || [];
    const keys = updatedLevel.keys || [];
    const doors = updatedLevel.doors || [];

    const wallIndex = walls.findIndex(w => w.x === x && w.y === y);
    const isWall = wallIndex !== -1;

    if (editorMode !== 'wall' && isWall) {
      alert('⚠️ Célula ocupada por uma parede!');
      return;
    }

    if (editorMode === 'robot') {
      updatedLevel.robotStart = { x, y };
    } else if (editorMode === 'star') {
      if (updatedLevel.robotStart.x === x && updatedLevel.robotStart.y === y) {
        alert('⚠️ A estrela não pode estar na mesma posição do robô!');
        return;
      }

      // Check if star already exists at this position
      const starIndex = stars.findIndex(s => s.x === x && s.y === y);
      if (starIndex !== -1) {
        // Remove star
        updatedLevel.starPositions = stars.filter((_, i) => i !== starIndex);
      } else {
        // Add star
        updatedLevel.starPositions = [...stars, { x, y }];
      }
    } else if (editorMode === 'key') {
      // Check if key already exists at this position
      const keyIndex = keys.findIndex(k => k.position.x === x && k.position.y === y);
      if (keyIndex !== -1) {
        // Remove key
        updatedLevel.keys = keys.filter((_, i) => i !== keyIndex);
      } else {
        // Add key with default color (can be changed later)
        updatedLevel.keys = [...keys, { id: 'red', position: { x, y } }];
      }
    } else if (editorMode === 'door') {
      // Check if door already exists at this position
      const doorIndex = doors.findIndex(d => d.position.x === x && d.position.y === y);
      if (doorIndex !== -1) {
        // Remove door
        updatedLevel.doors = doors.filter((_, i) => i !== doorIndex);
      } else {
        // Add door with default color (can be changed later)
        updatedLevel.doors = [...doors, { id: 'red', position: { x, y } }];
      }
    } else if (editorMode === 'wall') {
      if (
        (updatedLevel.robotStart.x === x && updatedLevel.robotStart.y === y) ||
        stars.some(s => s.x === x && s.y === y)
      ) {
        alert('⚠️ Não é possível colocar parede na posição do robô ou estrela!');
        return;
      }

      if (isWall) {
        updatedLevel.obstacles = walls.filter((_, i) => i !== wallIndex);
      } else {
        updatedLevel.obstacles = [...walls, { x, y }];
      }
    }

    setCurrentLevel(updatedLevel);
  };

  const handleSave = () => {
    if (!currentLevel) return;

    if (!levelName.trim()) {
      alert('⚠️ Por favor, dê um nome ao nível!');
      return;
    }

    if (currentLevel.starPositions.length === 0) {
      alert('⚠️ O nível precisa ter pelo menos uma estrela!');
      return;
    }

    // Check if robot is on any star
    const robotOnStar = currentLevel.starPositions.some(
      s => s.x === currentLevel.robotStart.x && s.y === currentLevel.robotStart.y
    );
    if (robotOnStar) {
      alert('⚠️ O robô e a estrela não podem estar na mesma posição!');
      return;
    }

    const updatedLevel = { ...currentLevel, name: levelName };
    const updatedLevels = levels.map(l => (l.id === selectedLevelId ? updatedLevel : l));

    setLevels(updatedLevels);
    onSave(updatedLevels);
    alert('✅ Nível salvo com sucesso!');
  };

  const handleNewLevel = () => {
    const newId = Math.max(...levels.map(l => l.id)) + 1;
    const newLevel: LevelConfig = {
      id: newId,
      name: `Nível ${newId}`,
      robotStart: { x: 0, y: 0 },
      starPositions: [{ x: 4, y: 4 }],
      gridSize: 5,
      obstacles: [],
    };

    const updatedLevels = [...levels, newLevel];
    setLevels(updatedLevels);
    setSelectedLevelId(newId);
  };

  const handleDeleteLevel = () => {
    if (levels.length <= 1) {
      alert('⚠️ Você precisa ter pelo menos um nível!');
      return;
    }

    if (confirm(`Tem certeza que deseja deletar o ${currentLevel?.name}?`)) {
      const updatedLevels = levels.filter(l => l.id !== selectedLevelId);
      setLevels(updatedLevels);
      setSelectedLevelId(updatedLevels[0].id);
      onSave(updatedLevels);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('⚠️ Tem certeza que deseja resetar todos os níveis aos padrões? Todas as suas alterações serão perdidas!')) {
      const defaultLevels = [...LEVELS];
      setLevels(defaultLevels);
      setSelectedLevelId(1);
      onSave(defaultLevels);
      alert('✅ Níveis resetados aos padrões!');
    }
  };

  const renderGrid = () => {
    if (!currentLevel) return null;

    const size = currentLevel.gridSize || 5;
    const cells = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const isRobot = currentLevel.robotStart.x === x && currentLevel.robotStart.y === y;
        const isStar = currentLevel.starPositions.some(s => s.x === x && s.y === y);
        const isWall = currentLevel.obstacles?.some(w => w.x === x && w.y === y);
        const isKey = currentLevel.keys?.some(k => k.position.x === x && k.position.y === y);
        const isDoor = currentLevel.doors?.some(d => d.position.x === x && d.position.y === y);

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`${styles.gridCell} ${isRobot ? styles.robot : ''} ${isStar ? styles.star : ''} ${isWall ? styles.wall : ''} ${isKey ? styles.key : ''} ${isDoor ? styles.door : ''}`}
            onClick={() => handleCellClick(x, y)}
            title={`Posição (${x}, ${y})`}
          >
            {isRobot && <FaRobot />}
            {isStar && <FaStar />}
            {isWall && <FaSquare style={{ fontSize: '0.8em', opacity: 0.7 }} />}
            {isKey && <FaKey />}
            {isDoor && <FaDoorOpen />}
          </div>
        );
      }
    }
    return cells;
  };

  const editorContent = (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>🎮 Editor de Níveis</h2>
        {!asPage && (
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.editorSection}>
          <h3 className={styles.sectionTitle}>Selecione o Nível</h3>
          <div className={styles.levelSelector}>
            {levels.map(level => (
              <button
                key={level.id}
                className={`${styles.levelBtn} ${selectedLevelId === level.id ? styles.active : ''}`}
                onClick={() => setSelectedLevelId(level.id)}
              >
                Nível {level.id}
              </button>
            ))}
            <button className={styles.newLevelBtn} onClick={handleNewLevel}>
              <FaPlus /> Novo Nível
            </button>
          </div>
        </div>

        <div className={styles.editorSection}>
          <h3 className={styles.sectionTitle}>Configurações do Nível</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className={styles.inputGroup}>
              <label>Nome do Nível</label>
              <input
                type="text"
                value={levelName}
                onChange={e => setLevelName(e.target.value)}
                placeholder="Digite o nome do nível..."
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Tamanho (N x N)</label>
              <input
                type="number"
                min="3"
                max="10"
                value={currentLevel?.gridSize || 5}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  if (val >= 3 && val <= 10 && currentLevel) {
                    setCurrentLevel({
                      ...currentLevel,
                      gridSize: val,
                      robotStart: { x: 0, y: 0 },
                      starPositions: [{ x: val - 1, y: val - 1 }],
                      obstacles: [],
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.editorSection}>
          <h3 className={styles.sectionTitle}>Editor Visual</h3>

          <div className={styles.info}>
            💡 <strong>Dica:</strong> Selecione o modo e clique nas células da grade. No modo Estrela, clique novamente para remover.
          </div>

          <div className={styles.gridEditor}>
            <div className={styles.modeSelector}>
              <button
                className={`${styles.modeBtn} ${editorMode === 'robot' ? styles.active : ''}`}
                onClick={() => setEditorMode('robot')}
              >
                <FaRobot /> Robô
              </button>
              <button
                className={`${styles.modeBtn} ${editorMode === 'star' ? styles.active : ''}`}
                onClick={() => setEditorMode('star')}
              >
                <FaStar /> Estrela
              </button>
              <button
                className={`${styles.modeBtn} ${editorMode === 'key' ? styles.active : ''}`}
                onClick={() => setEditorMode('key')}
              >
                <FaKey /> Chave
              </button>
              <button
                className={`${styles.modeBtn} ${editorMode === 'door' ? styles.active : ''}`}
                onClick={() => setEditorMode('door')}
              >
                <FaDoorOpen /> Porta
              </button>
              <button
                className={`${styles.modeBtn} ${editorMode === 'wall' ? styles.active : ''}`}
                onClick={() => setEditorMode('wall')}
              >
                <FaSquare /> Parede
              </button>
            </div>

            <div
              className={styles.grid}
              style={{
                gridTemplateColumns: `repeat(${currentLevel?.gridSize || 5}, 50px)`,
                gridTemplateRows: `repeat(${currentLevel?.gridSize || 5}, 50px)`,
              }}
            >
              {renderGrid()}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.resetBtn} onClick={handleResetToDefaults}>
            🔄 Resetar aos Padrões
          </button>
          {levels.length > 1 && (
            <button className={styles.deleteBtn} onClick={handleDeleteLevel}>
              <FaTrash /> Deletar Nível
            </button>
          )}
          <button className={styles.saveBtn} onClick={handleSave}>
            <FaSave /> Salvar Alterações
          </button>
        </div>
      </div>
    </>
  );

  if (asPage) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageContent}>{editorContent}</div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {editorContent}
      </div>
    </div>
  );
};

export { LevelEditor };
export default LevelEditor;
