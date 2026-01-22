/**
 * LevelNavigation Component
 * Header with level info (no navigation buttons)
 */

import styles from './LevelNavigation.module.css';

interface LevelNavigationProps {
  levelName: string;
  currentLevelId: number;
  totalLevels: number;
}

export const LevelNavigation: React.FC<LevelNavigationProps> = ({
  levelName,
  currentLevelId,
  totalLevels,
}) => {
  return (
    <div className={styles.levelHeader}>
      <div className={styles.levelInfo}>
        <h2>{levelName}</h2>
        <p className={styles.levelCounter}>
          Nível {currentLevelId} de {totalLevels}
        </p>
      </div>
    </div>
  );
};

export default LevelNavigation;
