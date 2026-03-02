import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseSessionTimeoutOptions {
    timeout?: number; // in milliseconds
    warningTime?: number; // time before timeout to show warning
    onWarning?: () => void;
    onTimeout?: () => void;
}

export const useSessionTimeout = ({
    timeout = 30 * 60 * 1000, // 30 minutes
    warningTime = 2 * 60 * 1000, // 2 minutes
    onWarning,
    onTimeout,
}: UseSessionTimeoutOptions = {}) => {
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // Use number for browser-side timers
    const timeoutRef = useRef<number | null>(null);
    const warningRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);

    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        onTimeout?.();
        navigate('/admin');
    }, [navigate, onTimeout]);

    const resetTimer = useCallback(() => {
        // Clear existing timers
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        if (warningRef.current) window.clearTimeout(warningRef.current);
        if (intervalRef.current) window.clearInterval(intervalRef.current);

        setShowWarning(false);

        // Set warning timer
        warningRef.current = window.setTimeout(() => {
            setShowWarning(true);
            setTimeLeft(warningTime);
            onWarning?.();

            // Countdown interval
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1000) {
                        if (intervalRef.current) window.clearInterval(intervalRef.current);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        }, timeout - warningTime);

        // Set logout timer
        timeoutRef.current = window.setTimeout(logout, timeout);
    }, [timeout, warningTime, onWarning, logout]);

    const extendSession = useCallback(() => {
        resetTimer();
    }, [resetTimer]);

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            if (!showWarning) {
                resetTimer();
            }
        };

        // Start timer
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, handleActivity);
        });

        return () => {
            // Cleanup
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            if (warningRef.current) window.clearTimeout(warningRef.current);
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, [resetTimer, showWarning]);

    return {
        showWarning,
        timeLeft,
        extendSession,
        logout,
    };
};
