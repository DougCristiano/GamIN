/**
 * LevelNavigation Component
 * Navigation header with level info and prev/next buttons
 */

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './LevelNavigation.module.css';

interface LevelNavigationProps {
  levelName: string;
  currentLevelId: number;
  totalLevels: number;
  onPrevious: () => void;
  onNext: () => void;
  isFirstLevel: boolean;
  isLastLevel: boolean;
}

export const LevelNavigation: React.FC<LevelNavigationProps> = ({
  levelName,
  currentLevelId,
  totalLevels,
  onPrevious,
  onNext,
  isFirstLevel,
  isLastLevel,
}) => {
  return (
    <div className={styles.levelHeader}>
      <button
        onClick={onPrevious}
        disabled={isFirstLevel}
        className={styles.navBtn}
        title="Nível Anterior"
      >
        <FaChevronLeft />
      </button>

      <div className={styles.levelInfo}>
        <h2>{levelName}</h2>
        <p className={styles.levelCounter}>
          Nível {currentLevelId} de {totalLevels}
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={isLastLevel}
        className={styles.navBtn}
        title="Próximo Nível"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default LevelNavigation;
