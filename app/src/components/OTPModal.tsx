import React, { useState, useEffect, useRef } from 'react';
import OTPInput from './OTPInput';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface OTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onVerify: (otp: string) => Promise<boolean>;
    onResend: () => Promise<void>;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, email, onVerify, onResend }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [error, setError] = useState('');
    const [canResend, setCanResend] = useState(false);

    useFocusTrap(modalRef, isOpen, onClose);

    useEffect(() => {
        if (!isOpen) return;

        // Reset state on open
        setTimeLeft(300);
        setCanResend(false);
        setError('');

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Focus close button or first input on open
        setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 100);

        return () => clearInterval(timer);
    }, [isOpen]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = async (otp: string) => {
        if (otp.length !== 6) return;
        setLoading(true);
        setError('');
        try {
            const success = await onVerify(otp);
            if (success) {
                onClose();
            } else {
                setError('Invalid or expired OTP. Please try again.');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendClick = async () => {
        setLoading(true);
        setError('');
        try {
            await onResend();
            setTimeLeft(300);
            setCanResend(false);
        } catch (err) {
            setError('Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    ref={modalRef}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />

                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🔐
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Verify Your Identity</h2>
                        <p className="text-slate-600 mt-2">
                            We've sent a 6-digit code to <br />
                            <span className="font-semibold text-blue-600">{email}</span>
                        </p>
                    </div>

                    <OTPInput onComplete={handleVerify} />

                    {error && (
                        <p className="text-red-500 text-center text-sm mb-4 font-medium animate-pulse">
                            {error}
                        </p>
                    )}

                    <div className="text-center mt-6">
                        <p className="text-slate-500 mb-4 text-sm">
                            Code expires in <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                        </p>

                        <button
                            onClick={handleResendClick}
                            disabled={!canResend || loading}
                            className={`text-sm font-medium transition-colors ${canResend
                                ? 'text-blue-600 hover:text-blue-800 underline cursor-pointer'
                                : 'text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {loading ? 'Sending...' : "Didn't receive the code? Resend"}
                        </button>
                    </div>

                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        aria-label="Close verification modal"
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        ✕
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OTPModal;
