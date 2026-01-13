
import React, { useState } from 'react';
import styles from './Header.module.css';
import { FaEdit } from 'react-icons/fa';
import LevelEditor from './LevelEditor';

interface HeaderProps {
    onLevelsUpdate?: (levels: any[]) => void;
}

const Header: React.FC<HeaderProps> = ({ onLevelsUpdate }) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const handleSaveLevels = (levels: any[]) => {
        if (onLevelsUpdate) {
            onLevelsUpdate(levels);
        }
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.logoContainer}>
                    <span className={styles.logoText}>
                        In<span className={styles.logoAccent}>JUNIOR</span>
                    </span>
                </div>
                <nav className={styles.nav}>
                    <a href="#" className={styles.navLink}>Início</a>
                    <a href="#" className={styles.navLink}>Sobre Nós</a>
                    <a href="#" className={styles.navLink}>Projetos</a>
                    <button
                        className={styles.editorBtn}
                        onClick={() => setIsEditorOpen(true)}
                    >
                        <FaEdit /> Editor de Níveis
                    </button>
                </nav>
            </header>

            <LevelEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSave={handleSaveLevels}
            />
        </>
    );
};

export default Header;
