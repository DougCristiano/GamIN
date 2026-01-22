import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { RetroModal } from '@/components';
import type { RetroModalProps } from '@/components';

interface ModalContextType {
    showAlert: (message: ReactNode, title?: string, onClose?: () => void) => void;
    showConfirm: (message: ReactNode, title?: string, onConfirm?: () => void, onCancel?: () => void) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalProps, setModalProps] = useState<Partial<RetroModalProps>>({ isOpen: false });

    const hideModal = useCallback(() => {
        setModalProps((prev: Partial<RetroModalProps>) => ({ ...prev, isOpen: false }));
    }, []);

    const showAlert = useCallback((message: ReactNode, title: string = 'Aviso', onClose?: () => void) => {
        setModalProps({
            isOpen: true,
            message,
            title,
            type: 'info',
            onClose: () => {
                hideModal();
                if (onClose) onClose();
            },
            onConfirm: undefined, // ensure confirm specific props are reset
        });
    }, [hideModal]);

    const showConfirm = useCallback((message: ReactNode, title: string = 'Confirmação', onConfirm?: () => void, onCancel?: () => void) => {
        setModalProps({
            isOpen: true,
            message,
            title,
            type: 'confirm',
            onClose: () => {
                hideModal();
                if (onCancel) onCancel();
            },
            onConfirm: () => {
                hideModal();
                if (onConfirm) onConfirm();
            },
            confirmText: 'Confirmar',
            cancelText: 'Cancelar'
        });
    }, [hideModal]);

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm, hideModal }}>
            {children}
            <RetroModal
                isOpen={!!modalProps.isOpen}
                message={modalProps.message}
                title={modalProps.title}
                type={modalProps.type}
                onClose={modalProps.onClose || hideModal}
                onConfirm={modalProps.onConfirm}
                confirmText={modalProps.confirmText}
                cancelText={modalProps.cancelText}
            />
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
