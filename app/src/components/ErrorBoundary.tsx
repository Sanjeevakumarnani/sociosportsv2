import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0B1121] text-white text-center">
                    <h1 className="text-4xl font-bold mb-4 text-[#C5A35C]">Something went wrong</h1>
                    <p className="text-gray-400 mb-8 max-w-md">
                        The application encountered an unexpected error. We've been notified and are working to fix it.
                    </p>
                    <pre className="p-4 bg-black/50 rounded-lg text-left text-xs overflow-auto max-w-full mb-8 border border-[#C5A35C]/20 text-[#C5A35C]">
                        {this.state.error?.message}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-[#C5A35C] text-black font-semibold rounded-full hover:bg-[#D4B46D] transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
