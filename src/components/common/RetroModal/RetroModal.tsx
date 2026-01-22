import React, { useEffect } from 'react';
import styles from './RetroModal.module.css';

export interface RetroModalProps {
    isOpen: boolean;
    title?: string;
    message: React.ReactNode;
    type?: 'info' | 'confirm' | 'error' | 'success';
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const RetroModal: React.FC<RetroModalProps> = ({
    isOpen,
    title = 'Aviso',
    message,
    type = 'info',
    onClose,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    {message}
                </div>
                <div className={styles.modalFooter}>
                    {type === 'confirm' ? (
                        <>
                            <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
                                {cancelText}
                            </button>
                            <button
                                className={`${styles.button} ${styles.confirmButton}`}
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    else onClose();
                                }}
                            >
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button className={`${styles.button} ${styles.infoButton}`} onClick={onClose}>
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
