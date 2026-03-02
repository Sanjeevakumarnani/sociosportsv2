import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';
import { gsap } from 'gsap';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Show banner after a small delay
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');

        // Animate out
        gsap.to('#cookie-banner', {
            y: 100,
            opacity: 0,
            duration: 0.5,
            onComplete: () => setIsVisible(false)
        });
    };

    if (!isVisible) return null;

    return (
        <div
            id="cookie-banner"
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
            <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl bg-opacity-95">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--accent-orange)]/10 rounded-xl hidden sm:block">
                        <Cookie className="w-6 h-6 text-[var(--accent-orange)]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                            We value your privacy
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                            By clicking "Accept All", you consent to our use of cookies.
                            Read our <Link to="/privacy-policy" className="text-[var(--accent-orange)] hover:underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none btn-primary whitespace-nowrap"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        aria-label="Close cookie banner"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
