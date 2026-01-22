import { useState, useEffect } from 'react';
import { FaTimes, FaRobot, FaStar, FaSave, FaPlus, FaTrash, FaSquare, FaKey, FaDoorOpen } from 'react-icons/fa';
import type { LevelConfig, CellColor } from '@/types';
import { LEVELS } from '@/data';
import { KEY_COLORS, getKeyColor } from '@/utils/keyColors';
import styles from './LevelEditor.module.css';
import { FaPaintBrush } from 'react-icons/fa';
import { useModal } from '@/contexts';

interface LevelEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (levels: LevelConfig[]) => void;
  asPage?: boolean;
}

type EditorMode = 'robot' | 'star' | 'wall' | 'key' | 'door' | 'paint';

const LevelEditor: React.FC<LevelEditorProps> = ({ isOpen, onClose, onSave, asPage = false }) => {
  const { showAlert, showConfirm } = useModal();
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
  const [selectedColor, setSelectedColor] = useState<string>('red');
  const [selectedCellColor, setSelectedCellColor] = useState<CellColor>('RED');
  const [levelName, setLevelName] = useState('');

  const CELL_COLORS: Record<CellColor, string> = {
    RED: '#ef4444',
    GREEN: '#22c55e',
    BLUE: '#3b82f6',
  };

  useEffect(() => {
    if (selectedLevelId) {
      const level = levels.find(l => l.id === selectedLevelId);
      if (level) {
        setCurrentLevel({
          ...level,
          obstacles: level.obstacles || [],
          keys: level.keys || [],
          doors: level.doors || [],
          coloredCells: level.coloredCells || [],
          gridSize: level.gridSize || 5,
        });
        setLevelName(level.name);
        // Não resetar tempGridSize aqui automaticamente para evitar resets durante edição
        // A sincronização será feita explicitamente ao selecionar um nível
      }
    }
  }, [selectedLevelId, levels]);

  // Estado local para o input de tamanho do grid para permitir edição livre
  const [tempGridSize, setTempGridSize] = useState<string>('5');

  const handleSelectLevel = (id: number) => {
    setSelectedLevelId(id);
    const level = levels.find(l => l.id === id);
    if (level) {
      setTempGridSize((level.gridSize || 5).toString());
    }
  };

  // Inicializar tempGridSize quando carrega
  useEffect(() => {
    // Apenas na primeira carga
    if (selectedLevelId && levels.length > 0) {
      const level = levels.find(l => l.id === selectedLevelId);
      if (level) {
        setTempGridSize((level.gridSize || 5).toString());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Apenas mount

  if (!isOpen) return null;

  const handleCellClick = (x: number, y: number) => {
    if (!currentLevel) return;

    const updatedLevel = { ...currentLevel };
    const walls = updatedLevel.obstacles || [];
    const stars = updatedLevel.starPositions || [];
    const keys = updatedLevel.keys || [];
    const doors = updatedLevel.doors || [];

    // Helper function to check if cell is occupied by any element
    const isCellOccupied = (checkX: number, checkY: number, excludeType?: string) => {
      const hasRobot = excludeType !== 'robot' && updatedLevel.robotStart.x === checkX && updatedLevel.robotStart.y === checkY;
      const hasStar = excludeType !== 'star' && stars.some(s => s.x === checkX && s.y === checkY);
      const hasKey = excludeType !== 'key' && keys.some(k => k.position.x === checkX && k.position.y === checkY);
      const hasDoor = excludeType !== 'door' && doors.some(d => d.position.x === checkX && d.position.y === checkY);
      const hasWall = excludeType !== 'wall' && walls.some(w => w.x === checkX && w.y === checkY);
      return hasRobot || hasStar || hasKey || hasDoor || hasWall;
    };

    const wallIndex = walls.findIndex(w => w.x === x && w.y === y);
    const isWall = wallIndex !== -1;

    if (editorMode !== 'wall' && isWall) {
      showAlert('⚠️ Célula ocupada por uma parede!');
      return;
    }

    if (editorMode === 'robot') {
      if (isCellOccupied(x, y, 'robot')) {
        showAlert('⚠️ Esta célula já está ocupada! Remova o elemento existente primeiro.');
        return;
      }
      updatedLevel.robotStart = { x, y };
    } else if (editorMode === 'star') {
      if (updatedLevel.robotStart.x === x && updatedLevel.robotStart.y === y) {
        showAlert('⚠️ A estrela não pode estar na mesma posição do robô!');
        return;
      }

      // Check if star already exists at this position
      const starIndex = stars.findIndex(s => s.x === x && s.y === y);
      if (starIndex !== -1) {
        // Remove star
        updatedLevel.starPositions = stars.filter((_, i) => i !== starIndex);
      } else {
        // Check if cell is occupied by other elements
        if (isCellOccupied(x, y, 'star')) {
          showAlert('⚠️ Esta célula já está ocupada! Remova o elemento existente primeiro.');
          return;
        }
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
        // Check if cell is occupied by other elements
        if (isCellOccupied(x, y, 'key')) {
          showAlert('⚠️ Esta célula já está ocupada! Remova o elemento existente primeiro.');
          return;
        }
        // Add key with selected color
        updatedLevel.keys = [...keys, { id: selectedColor, position: { x, y } }];
      }
    } else if (editorMode === 'door') {
      // Check if door already exists at this position
      const doorIndex = doors.findIndex(d => d.position.x === x && d.position.y === y);
      if (doorIndex !== -1) {
        // Remove door
        updatedLevel.doors = doors.filter((_, i) => i !== doorIndex);
      } else {
        // Check if cell is occupied by other elements
        if (isCellOccupied(x, y, 'door')) {
          showAlert('⚠️ Esta célula já está ocupada! Remova o elemento existente primeiro.');
          return;
        }
        // Add door with selected color
        updatedLevel.doors = [...doors, { id: selectedColor, position: { x, y } }];
      }
    } else if (editorMode === 'wall') {
      if (
        (updatedLevel.robotStart.x === x && updatedLevel.robotStart.y === y) ||
        stars.some(s => s.x === x && s.y === y)
      ) {
        showAlert('⚠️ Não é possível colocar parede na posição do robô ou estrela!');
        return;
      }

      if (isWall) {
        updatedLevel.obstacles = walls.filter((_, i) => i !== wallIndex);
      } else {
        // Check if cell is occupied by other elements
        if (isCellOccupied(x, y, 'wall')) {
          showAlert('⚠️ Esta célula já está ocupada! Remova o elemento existente primeiro.');
          return;
        }
        updatedLevel.obstacles = [...walls, { x, y }];
      }
    } else if (editorMode === 'paint') {
      if (isWall) {
        showAlert('⚠️ Não é possível pintar uma parede!');
        return;
      }

      const coloredCells = updatedLevel.coloredCells || [];
      const cellIndex = coloredCells.findIndex(c => c.position.x === x && c.position.y === y);

      if (cellIndex !== -1 && coloredCells[cellIndex].color === selectedCellColor) {
        // Remove color if clicking again with same color
        updatedLevel.coloredCells = coloredCells.filter((_, i) => i !== cellIndex);
      } else {
        // Add or update color
        const otherCells = coloredCells.filter((_, i) => i !== cellIndex);
        updatedLevel.coloredCells = [...otherCells, { position: { x, y }, color: selectedCellColor }];
      }
    }

    setCurrentLevel(updatedLevel);
  };

  const handleSave = () => {
    if (!currentLevel) return;

    if (!levelName.trim()) {
      showAlert('⚠️ Por favor, dê um nome ao nível!');
      return;
    }

    if (currentLevel.starPositions.length === 0) {
      showAlert('⚠️ O nível precisa ter pelo menos uma estrela!');
      return;
    }

    // Check if robot is on any star
    const robotOnStar = currentLevel.starPositions.some(
      s => s.x === currentLevel.robotStart.x && s.y === currentLevel.robotStart.y
    );
    if (robotOnStar) {
      showAlert('⚠️ O robô e a estrela não podem estar na mesma posição!');
      return;
    }

    const updatedLevel = { ...currentLevel, name: levelName };
    const updatedLevels = levels.map(l => (l.id === selectedLevelId ? updatedLevel : l));

    setLevels(updatedLevels);
    onSave(updatedLevels);
    showAlert('✅ Nível salvo com sucesso!');
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
      showAlert('⚠️ Você precisa ter pelo menos um nível!');
      return;
    }

    showConfirm(
      `Tem certeza que deseja deletar o ${currentLevel?.name}?`,
      'Confirmar Exclusão',
      () => {
        const updatedLevels = levels.filter(l => l.id !== selectedLevelId);
        setLevels(updatedLevels);
        setSelectedLevelId(updatedLevels[0].id);
        onSave(updatedLevels);
      }
    );
  };

  const handleResetToDefaults = () => {
    showConfirm(
      '⚠️ Tem certeza que deseja resetar todos os níveis aos padrões? Todas as suas alterações serão perdidas!',
      'Resetar Tudo',
      () => {
        const defaultLevels = [...LEVELS];
        setLevels(defaultLevels);
        setSelectedLevelId(1);
        onSave(defaultLevels);
        showAlert('✅ Níveis resetados aos padrões!');
      }
    );
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
        const coloredCell = currentLevel.coloredCells?.find(c => c.position.x === x && c.position.y === y);
        const backgroundColor = coloredCell ? CELL_COLORS[coloredCell.color] + '66' : undefined;

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`${styles.gridCell} ${isRobot ? styles.robot : ''} ${isStar ? styles.star : ''} ${isWall ? styles.wall : ''} ${isKey ? styles.key : ''} ${isDoor ? styles.door : ''}`}
            onClick={() => handleCellClick(x, y)}
            title={`Posição (${x}, ${y})`}
            style={{ backgroundColor }}
          >
            {isRobot && <FaRobot />}
            {isStar && <FaStar />}
            {isWall && <FaSquare style={{ fontSize: '0.8em', opacity: 0.7 }} />}
            {isKey && (
              <FaKey
                style={{
                  color: getKeyColor(
                    currentLevel.keys?.find(k => k.position.x === x && k.position.y === y)?.id || 'red'
                  ),
                }}
              />
            )}
            {isDoor && (
              <FaDoorOpen
                style={{
                  color: getKeyColor(
                    currentLevel.doors?.find(d => d.position.x === x && d.position.y === y)?.id || 'red'
                  ),
                }}
              />
            )}
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
                onClick={() => handleSelectLevel(level.id)}
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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={tempGridSize}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || /^\d*$/.test(val)) {
                      setTempGridSize(val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Trigger apply logic
                      const btn = e.currentTarget.nextElementSibling as HTMLButtonElement;
                      btn?.click();
                    }
                  }}
                />
                <button
                  className={styles.modeBtn}
                  onClick={() => {
                    let val = parseInt(tempGridSize);
                    if (isNaN(val)) val = 5;

                    // Clamp value between 3 and 10
                    if (val < 3) val = 3;
                    if (val > 10) val = 10;

                    setTempGridSize(val.toString());

                    if (currentLevel && val !== currentLevel.gridSize) {
                      showConfirm(
                        '⚠️ Mudar o tamanho irá resetar o mapa. Continuar?',
                        'Mudar Tamanho',
                        () => {
                          setCurrentLevel({
                            ...currentLevel,
                            gridSize: val,
                            robotStart: { x: 0, y: 0 },
                            starPositions: [{ x: val - 1, y: val - 1 }],
                            obstacles: [],
                            keys: [],
                            doors: [],
                            coloredCells: []
                          });
                        },
                        () => {
                          // Revert input to current level size
                          setTempGridSize(currentLevel.gridSize?.toString() || '5');
                        }
                      );
                    }
                  }}
                  title="Aplicar novo tamanho"
                  style={{ padding: '0 1rem', background: '#2563eb', color: 'white', border: 'none' }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className={styles.inputGroup}>
              <label>Limite de Comandos na Fila</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={currentLevel?.maxCommands || ''}
                onChange={e => {
                  const valStr = e.target.value;
                  if (valStr === '' || /^\d*$/.test(valStr)) {
                    const val = valStr === '' ? undefined : parseInt(valStr);
                    if (currentLevel) {
                      setCurrentLevel({
                        ...currentLevel,
                        maxCommands: val,
                      });
                    }
                  }
                }}
                placeholder="Ilimitado"
              />
              <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                Deixe vazio para ilimitado
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label>Tempo Limite (segundos)</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={currentLevel?.timeLimit || ''}
                onChange={e => {
                  const valStr = e.target.value;
                  if (valStr === '' || /^\d*$/.test(valStr)) {
                    const val = valStr === '' ? undefined : parseInt(valStr);
                    if (currentLevel) {
                      setCurrentLevel({
                        ...currentLevel,
                        timeLimit: val,
                      });
                    }
                  }
                }}
                placeholder="Sem limite"
              />
              <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                Deixe vazio para sem limite de tempo
              </small>
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
            <div className={styles.inputGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={currentLevel?.tutorialMode || false}
                  onChange={e => {
                    if (currentLevel) {
                      setCurrentLevel({
                        ...currentLevel,
                        tutorialMode: e.target.checked,
                      });
                    }
                  }}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Ativar Modo Tutorial
              </label>
              <small style={{ color: 'var(--color-text-muted)', marginLeft: '26px' }}>
                Se ativado, um modal com explicação aparecerá antes do nível começar.
              </small>
            </div>

            {currentLevel?.tutorialMode && (
              <div className={styles.inputGroup} style={{ marginTop: '0.5rem', marginLeft: '26px' }}>
                <label>Texto Explicativo</label>
                <textarea
                  value={currentLevel.tutorialText || ''}
                  onChange={e => {
                    if (currentLevel) {
                      setCurrentLevel({
                        ...currentLevel,
                        tutorialText: e.target.value,
                      });
                    }
                  }}
                  placeholder="Escreva aqui as instruções ou dicas que o jogador deve ler..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#1a1a2e',
                    color: '#e0e0e0',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className={styles.subSectionTitle}>
              Funções Disponíveis (deixe vazio para desabilitar)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className={styles.inputGroup}>
                <label>F0 - Limite</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={currentLevel?.functionLimits?.F0 || ''}
                  onChange={e => {
                    const valStr = e.target.value;
                    if (valStr === '' || /^\d*$/.test(valStr)) {
                      const val = valStr === '' ? undefined : parseInt(valStr);
                      if (currentLevel) {
                        setCurrentLevel({
                          ...currentLevel,
                          functionLimits: {
                            ...currentLevel.functionLimits,
                            F0: val,
                          },
                        });
                      }
                    }
                  }}
                  placeholder="Desabilitada"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>F1 - Limite</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={currentLevel?.functionLimits?.F1 || ''}
                  onChange={e => {
                    const valStr = e.target.value;
                    if (valStr === '' || /^\d*$/.test(valStr)) {
                      const val = valStr === '' ? undefined : parseInt(valStr);
                      if (currentLevel) {
                        setCurrentLevel({
                          ...currentLevel,
                          functionLimits: {
                            ...currentLevel.functionLimits,
                            F1: val,
                          },
                        });
                      }
                    }
                  }}
                  placeholder="Desabilitada"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>F2 - Limite</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={currentLevel?.functionLimits?.F2 || ''}
                  onChange={e => {
                    const valStr = e.target.value;
                    if (valStr === '' || /^\d*$/.test(valStr)) {
                      const val = valStr === '' ? undefined : parseInt(valStr);
                      if (currentLevel) {
                        setCurrentLevel({
                          ...currentLevel,
                          functionLimits: {
                            ...currentLevel.functionLimits,
                            F2: val,
                          },
                        });
                      }
                    }
                  }}
                  placeholder="Desabilitada"
                />
              </div>
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
              <button
                className={`${styles.modeBtn} ${editorMode === 'paint' ? styles.active : ''}`}
                onClick={() => setEditorMode('paint')}
              >
                <FaPaintBrush /> Pintar
              </button>
            </div>

            {/* Color Selector - Only show when in key or door mode */}
            {(editorMode === 'key' || editorMode === 'door') && (
              <div className={styles.colorSelector}>
                <label className={styles.colorLabel}>
                  Escolha a cor da {editorMode === 'key' ? 'chave' : 'porta'}:
                </label>
                <div className={styles.colorOptions}>
                  {Object.entries(KEY_COLORS).map(([colorId, colorHex]) => (
                    <button
                      key={colorId}
                      className={`${styles.colorBtn} ${selectedColor === colorId ? styles.activeColor : ''}`}
                      style={{
                        backgroundColor: colorHex,
                        border: selectedColor === colorId ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
                      }}
                      onClick={() => setSelectedColor(colorId)}
                      title={colorId}
                    >
                      {selectedColor === colorId && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cell Color Selector - Only show when in paint mode */}
            {editorMode === 'paint' && (
              <div className={styles.colorSelector}>
                <label className={styles.colorLabel}>
                  Escolha a cor da célula:
                </label>
                <div className={styles.colorOptions}>
                  {Object.entries(CELL_COLORS).map(([colorName, colorHex]) => (
                    <button
                      key={colorName}
                      className={`${styles.colorBtn} ${selectedCellColor === colorName ? styles.activeColor : ''}`}
                      style={{
                        backgroundColor: colorHex,
                        border: selectedCellColor === colorName ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
                      }}
                      onClick={() => setSelectedCellColor(colorName as CellColor)}
                      title={colorName}
                    >
                      {selectedCellColor === colorName && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
