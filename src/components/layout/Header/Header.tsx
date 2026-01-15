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
    navigate('/editor');
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
        <a
          href="#"
          className={styles.navLink}
          onClick={e => {
            e.preventDefault();
            handleHomeClick();
          }}
        >
          Início
        </a>
        <a href="#" className={styles.navLink}>
          Sobre Nós
        </a>
        <a href="#" className={styles.navLink}>
          Projetos
        </a>
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
