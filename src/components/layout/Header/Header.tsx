import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import type { LevelConfig } from '@/types';
import styles from './Header.module.css';

interface HeaderProps {
  onLevelsUpdate?: (levels: LevelConfig[]) => void;
  hideEditorButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hideEditorButton = false }) => {
  const navigate = useNavigate();

  const handleEditorClick = () => {
    window.open('/editor', '_blank');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer} onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
        <span className={styles.logoText}>
          In<span className={styles.logoAccent}>JUNIOR</span>
        </span>
      </div>
      <nav className={styles.nav}>
        {!hideEditorButton && (
          <button className={styles.editorBtn} onClick={handleEditorClick}>
            <FaEdit /> Editor de Níveis
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
