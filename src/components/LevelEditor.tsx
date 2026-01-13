import React, { useState, useEffect } from 'react';
import styles from './LevelEditor.module.css';
import { FaTimes, FaRobot, FaStar, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import type { LevelConfig } from '../types/tipos';
import { LEVELS } from '../levels/levelConfig';

interface LevelEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (levels: LevelConfig[]) => void;
}

type EditorMode = 'robot' | 'star';

const LevelEditor: React.FC<LevelEditorProps> = ({ isOpen, onClose, onSave }) => {
    const [levels, setLevels] = useState<LevelConfig[]>([...LEVELS]);
    const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
    const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
    const [editorMode, setEditorMode] = useState<EditorMode>('robot');
    const [levelName, setLevelName] = useState('');

    useEffect(() => {
        if (selectedLevelId) {
            const level = levels.find(l => l.id === selectedLevelId);
            if (level) {
                setCurrentLevel({ ...level });
                setLevelName(level.name);
            }
        }
    }, [selectedLevelId, levels]);

    if (!isOpen) return null;

    const handleCellClick = (x: number, y: number) => {
        if (!currentLevel) return;

        const updatedLevel = { ...currentLevel };

        if (editorMode === 'robot') {
            updatedLevel.robotStart = { x, y };
        } else if (editorMode === 'star') {
            // Verifica se não está na mesma posição do robô
            if (updatedLevel.robotStart.x === x && updatedLevel.robotStart.y === y) {
                alert('⚠️ A estrela não pode estar na mesma posição do robô!');
                return;
            }
            updatedLevel.starPosition = { x, y };
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
        const cells = [];
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                const isRobot = currentLevel?.robotStart.x === x && currentLevel?.robotStart.y === y;
                const isStar = currentLevel?.starPosition.x === x && currentLevel?.starPosition.y === y;

                cells.push(
                    <div
                        key={`${x}-${y}`}
                        className={`${styles.gridCell} ${isRobot ? styles.robot : ''} ${isStar ? styles.star : ''}`}
                        onClick={() => handleCellClick(x, y)}
                        title={`Posição (${x}, ${y})`}
                    >
                        {isRobot && <FaRobot />}
                        {isStar && <FaStar />}
                    </div>
                );
            }
        }
        return cells;
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>🎮 Editor de Níveis</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FaTimes />
                    </button>
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

                    {/* Nome do Nível */}
                    <div className={styles.editorSection}>
                        <h3 className={styles.sectionTitle}>Nome do Nível</h3>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                value={levelName}
                                onChange={(e) => setLevelName(e.target.value)}
                                placeholder="Digite o nome do nível..."
                            />
                        </div>
                    </div>

                    {/* Editor Visual */}
                    <div className={styles.editorSection}>
                        <h3 className={styles.sectionTitle}>Editor Visual</h3>

                        <div className={styles.info}>
                            💡 <strong>Dica:</strong> Selecione o modo (Robô ou Estrela) e clique nas células da grade para posicionar os elementos.
                        </div>

                        <div className={styles.gridEditor}>
                            {/* Seletor de Modo */}
                            <div className={styles.modeSelector}>
                                <button
                                    className={`${styles.modeBtn} ${editorMode === 'robot' ? styles.active : ''}`}
                                    onClick={() => setEditorMode('robot')}
                                >
                                    <FaRobot /> Posicionar Robô
                                </button>
                                <button
                                    className={`${styles.modeBtn} ${editorMode === 'star' ? styles.active : ''}`}
                                    onClick={() => setEditorMode('star')}
                                >
                                    <FaStar /> Posicionar Estrela
                                </button>
                            </div>

                            {/* Grade */}
                            <div className={styles.grid}>
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
            </div>
        </div>
    );
};

export default LevelEditor;
