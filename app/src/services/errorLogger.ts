// Simple logging service for frontend errors
// In a real production app, this would connect to Sentry, LogRocket, or similar

const LOG_LEVELS = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
};

class ErrorLogger {
    private static instance: ErrorLogger;
    private logs: any[] = [];
    private maxLogs = 100;

    private constructor() { }

    public static getInstance(): ErrorLogger {
        if (!ErrorLogger.instance) {
            ErrorLogger.instance = new ErrorLogger();
        }
        return ErrorLogger.instance;
    }

    public log(message: string, data?: any, level = LOG_LEVELS.INFO) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent,
        };

        console.log(`[${level.toUpperCase()}] ${message}`, data || '');

        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // specific handling for errors
        if (level === LOG_LEVELS.ERROR) {
            this.reportError(logEntry);
        }
    }

    public error(message: string, error?: any) {
        this.log(message, error, LOG_LEVELS.ERROR);
    }

    public warn(message: string, data?: any) {
        this.log(message, data, LOG_LEVELS.WARN);
    }

    public info(message: string, data?: any) {
        this.log(message, data, LOG_LEVELS.INFO);
    }

    private async reportError(logEntry: any) {
        // In production, send this to backend or Sentry
        // For now, we simulate a report in development
        if (import.meta.env.PROD) {
            try {
                // Example: await fetch('/api/logs/error', { method: 'POST', body: JSON.stringify(logEntry) });
            } catch (e) {
                console.error('Failed to report error', e);
            }
        }
    }

    public getLogs() {
        return this.logs;
    }
}

export const logger = ErrorLogger.getInstance();
