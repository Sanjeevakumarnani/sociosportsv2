import React, { useRef, useState, useEffect } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        // Allow only one digit
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Submit trigger
        const combinedOtp = newOtp.join('');
        if (combinedOtp.length === length) {
            onComplete(combinedOtp);
        }

        // Move to next input if value is entered
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, length).split('');
        if (data.length === length && data.every(char => !isNaN(Number(char)))) {
            setOtp(data);
            onComplete(data.join(''));
            inputRefs.current[length - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-2 justify-center my-4">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el) as any}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-300 rounded-md focus:border-blue-600 focus:outline-none transition-colors text-slate-900 bg-white"
                />
            ))}
        </div>
    );
};

export default OTPInput;
