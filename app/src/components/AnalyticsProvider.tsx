import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Fetch GA Measurement ID from environment variables
const GA_MEASUREMENT_ID = (import.meta as any).env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

interface AnalyticsContextType {
    trackEvent: (eventName: string, params?: Record<string, any>) => void;
    trackPageView: (path: string) => void;
    trackAppDownloadIntent: (platform: 'ios' | 'android', link: string) => void;
    trackFormSubmission: (formName: string, success: boolean, data?: any) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
    trackEvent: () => { },
    trackPageView: () => { },
    trackAppDownloadIntent: () => { },
    trackFormSubmission: () => { },
});

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
    // Initialize GA4
    useEffect(() => {
        if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
                send_page_view: false
            });
        `;
        document.head.appendChild(script2);

        if (import.meta.env.DEV) {
            console.log(`[Analytics] Initialized with ID: ${GA_MEASUREMENT_ID}`);
        }
    }, []);

    const trackEvent = (eventName: string, params?: Record<string, any>) => {
        if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', eventName, params);
        }
        if (import.meta.env.DEV) {
            console.log(`[Analytics] Event tracked: ${eventName}`, params);
        }
    };

    const trackAppDownloadIntent = (platform: 'ios' | 'android', link: string) => {
        trackEvent('app_download_intent', {
            platform,
            link,
            timestamp: new Date().toISOString()
        });

        // Dwell tracking simulation: log that we are about to redirect
        if (import.meta.env.DEV) {
            console.log(`[Analytics] Dwell tracking started for ${platform} redirect to ${link}`);
        }
    };

    const trackFormSubmission = (formName: string, success: boolean, data?: any) => {
        trackEvent('form_submission', {
            form_name: formName,
            success,
            ...data
        });
    };

    const trackPageView = (path: string) => {
        if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('config', GA_MEASUREMENT_ID, { page_path: path });
        }
        if (import.meta.env.DEV) {
            console.log(`[Analytics] Page view: ${path}`);
        }
    };

    return (
        <AnalyticsContext.Provider value={{ trackEvent, trackPageView, trackAppDownloadIntent, trackFormSubmission }}>
            <AnalyticsPageTracker trackPageView={trackPageView}>
                {children}
            </AnalyticsPageTracker>
        </AnalyticsContext.Provider>
    );
};

// Internal component to handle route changes
const AnalyticsPageTracker = ({ children, trackPageView }: { children: React.ReactNode, trackPageView: (path: string) => void }) => {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location, trackPageView]);

    return <>{children}</>;
};
