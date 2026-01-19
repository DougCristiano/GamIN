/**
 * LevelHistory Component
 * Displays a history of attempts with colored squares
 */

import styles from './LevelHistory.module.css';

export type LevelStatus = 'success' | 'fail' | 'pending' | 'current';

interface LevelHistoryProps {
    totalLevels: number;
    levelStatuses: Record<number, LevelStatus>;
    currentLevelId: number;
}

export const LevelHistory: React.FC<LevelHistoryProps> = ({ totalLevels, levelStatuses, currentLevelId }) => {
    // Generate array of level IDs from 1 to totalLevels
    const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

    const getStatusClass = (levelId: number, status?: LevelStatus) => {
        if (status === 'success') return styles.success;
        if (status === 'fail') return styles.fail;
        if (levelId === currentLevelId) return styles.current;
        return styles.pending;
    };

    const getTitle = (levelId: number, status?: LevelStatus) => {
        if (status === 'success') return `Nível ${levelId}: Sucesso`;
        if (status === 'fail') return `Nível ${levelId}: Falha`;
        if (levelId === currentLevelId) return `Nível ${levelId}: Atual`;
        return `Nível ${levelId}: Pendente`;
    };

    return (
        <div className={styles.historyContainer}>
            <h3 className={styles.title}>Progresso</h3>
            <div className={styles.grid}>
                {levels.map((levelId) => (
                    <div
                        key={levelId}
                        className={`${styles.historyItem} ${getStatusClass(levelId, levelStatuses[levelId])}`}
                        title={getTitle(levelId, levelStatuses[levelId])}
                    >
                        {levelId}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LevelHistory;
