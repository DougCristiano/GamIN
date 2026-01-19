/**
 * Timer Component
 * Displays countdown timer for level
 */

import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import styles from './Timer.module.css';

interface TimerProps {
    timeLimit: number; // in seconds
    isRunning: boolean;
    onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ timeLimit, isRunning, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    useEffect(() => {
        setTimeLeft(timeLimit);
    }, [timeLimit]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isLowTime = timeLeft <= 10;

    return (
        <div className={`${styles.timer} ${isLowTime ? styles.warning : ''}`}>
            <FaClock />
            <span className={styles.time}>
                {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
        </div>
    );
};

export default Timer;
