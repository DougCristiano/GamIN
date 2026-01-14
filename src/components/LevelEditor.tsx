import React, { useState, useEffect } from 'react';
import styles from './LevelEditor.module.css';
import { FaTimes, FaRobot, FaStar, FaSave, FaPlus, FaTrash, FaSquare } from 'react-icons/fa';
import type { LevelConfig, Position } from '../types/tipos';
import { LEVELS } from '../levels/levelConfig';

interface LevelEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (levels: LevelConfig[]) => void;
    asPage?: boolean;
}

type EditorMode = 'robot' | 'star' | 'wall';

const LevelEditor: React.FC<LevelEditorProps> = ({ isOpen, onClose, onSave, asPage = false }) => {
    const [levels, setLevels] = useState<LevelConfig[]>([...LEVELS]);
    const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
    const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
    const [editorMode, setEditorMode] = useState<EditorMode>('robot');
    const [levelName, setLevelName] = useState('');

    useEffect(() => {
        if (selectedLevelId) {
            const level = levels.find(l => l.id === selectedLevelId);
            if (level) {
                // Garante que obstacles e gridSize existam
                setCurrentLevel({
                    ...level,
                    obstacles: level.obstacles || [],
                    gridSize: level.gridSize || 5
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

        // Verifica se clicou em uma parede existente
        const wallIndex = walls.findIndex(w => w.x === x && w.y === y);
        const isWall = wallIndex !== -1;

        // Se o modo não for parede, impede colocar em cima de parede
        if (editorMode !== 'wall' && isWall) {
            alert('⚠️ Célula ocupada por uma parede!');
            return;
        }

        if (editorMode === 'robot') {
            updatedLevel.robotStart = { x, y };
        } else if (editorMode === 'star') {
            // Verifica se não está na mesma posição do robô
            if (updatedLevel.robotStart.x === x && updatedLevel.robotStart.y === y) {
                alert('⚠️ A estrela não pode estar na mesma posição do robô!');
                return;
            }
            updatedLevel.starPosition = { x, y };
        } else if (editorMode === 'wall') {
            // Verifica se não está na posição do robô ou estrela
            if ((updatedLevel.robotStart.x === x && updatedLevel.robotStart.y === y) ||
                (updatedLevel.starPosition.x === x && updatedLevel.starPosition.y === y)) {
                alert('⚠️ Não é possível colocar parede na posição do robô ou estrela!');
                return;
            }

            if (isWall) {
                // Remove parede
                updatedLevel.obstacles = walls.filter((_, i) => i !== wallIndex);
            } else {
                // Adiciona parede
                updatedLevel.obstacles = [...walls, { x, y }];
            }
        }

        setCurrentLevel(updatedLevel);
    };

    const handleSave = () => {
        if (!currentLevel) return;

        // Validação
        if (!levelName.trim()) {
            alert('⚠️ Por favor, dê um nome ao nível!');
            return;
        }

        if (currentLevel.robotStart.x === currentLevel.starPosition.x &&
            currentLevel.robotStart.y === currentLevel.starPosition.y) {
            alert('⚠️ O robô e a estrela não podem estar na mesma posição!');
            return;
        }

        const updatedLevel = { ...currentLevel, name: levelName };
        const updatedLevels = levels.map(l =>
            l.id === selectedLevelId ? updatedLevel : l
        );

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
            starPosition: { x: 4, y: 4 },
            gridSize: 5,
            obstacles: []
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

    const renderGrid = () => {
        if (!currentLevel) return null;

        const size = currentLevel.gridSize || 5;
        const cells = [];

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const isRobot = currentLevel.robotStart.x === x && currentLevel.robotStart.y === y;
                const isStar = currentLevel.starPosition.x === x && currentLevel.starPosition.y === y;
                const isWall = currentLevel.obstacles?.some(w => w.x === x && w.y === y);

                cells.push(
                    <div
                        key={`${x}-${y}`}
                        className={`${styles.gridCell} ${isRobot ? styles.robot : ''} ${isStar ? styles.star : ''} ${isWall ? styles.wall : ''}`}
                        onClick={() => handleCellClick(x, y)}
                        title={`Posição (${x}, ${y})`}
                    >
                        {isRobot && <FaRobot />}
                        {isStar && <FaStar />}
                        {isWall && <FaSquare style={{ fontSize: '0.8em', opacity: 0.7 }} />}
                    </div>
                );
            }
        }
        return cells;
    };

    // Conteúdo do editor (reutilizado em ambos os modos)
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
                {/* Seletor de Níveis */}
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

                {/* Configurações do Nível (Nome e Tamanho) */}
                <div className={styles.editorSection}>
                    <h3 className={styles.sectionTitle}>Configurações do Nível</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div className={styles.inputGroup}>
                            <label>Nome do Nível</label>
                            <input
                                type="text"
                                value={levelName}
                                onChange={(e) => setLevelName(e.target.value)}
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
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val >= 3 && val <= 10 && currentLevel) {
                                        setCurrentLevel({
                                            ...currentLevel,
                                            gridSize: val,
                                            // Reseta posições se ficarem fora do grid
                                            robotStart: { x: 0, y: 0 },
                                            starPosition: { x: val - 1, y: val - 1 },
                                            obstacles: []
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Editor Visual */}
                <div className={styles.editorSection}>
                    <h3 className={styles.sectionTitle}>Editor Visual</h3>

                    <div className={styles.info}>
                        💡 <strong>Dica:</strong> Selecione o modo e clique nas células da grade.
                    </div>

                    <div className={styles.gridEditor}>
                        {/* Seletor de Modo */}
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
                                className={`${styles.modeBtn} ${editorMode === 'wall' ? styles.active : ''}`}
                                onClick={() => setEditorMode('wall')}
                            >
                                <FaSquare /> Parede
                            </button>
                        </div>

                        {/* Grade */}
                        <div
                            className={styles.grid}
                            style={{
                                gridTemplateColumns: `repeat(${currentLevel?.gridSize || 5}, 50px)`,
                                gridTemplateRows: `repeat(${currentLevel?.gridSize || 5}, 50px)`
                            }}
                        >
                            {renderGrid()}
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className={styles.actions}>
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

    // Se for página, renderiza sem overlay e com classe pageContent
    if (asPage) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.pageContent}>
                    {editorContent}
                </div>
            </div>
        );
    }

    // Se for modal, renderiza com overlay
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {editorContent}
            </div>
        </div>
    );
};

export default LevelEditor;
