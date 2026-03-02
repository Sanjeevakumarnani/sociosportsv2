import { useEffect, useCallback } from 'react';

export const useFocusTrap = (
    ref: React.RefObject<HTMLElement | null>,
    isOpen: boolean,
    onClose: () => void
) => {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen || !ref.current) return;

        if (e.key === 'Escape') {
            onClose();
            return;
        }

        if (e.key === 'Tab') {
            const focusableElements = ref.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as NodeListOf<HTMLElement>;

            if (focusableElements.length === 0) return;

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    }, [isOpen, onClose, ref]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Optional: Auto-focus the first element or the container
            // ref.current?.focus(); 
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);
};
