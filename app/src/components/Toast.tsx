import { Toaster } from 'react-hot-toast';

const ToastContainer = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)',
                },
                success: {
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                    },
                    style: {
                        borderLeft: '4px solid #10b981',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                    style: {
                        borderLeft: '4px solid #ef4444',
                    },
                },
                loading: {
                    iconTheme: {
                        primary: 'var(--accent-orange)',
                        secondary: '#fff',
                    },
                    style: {
                        borderLeft: '4px solid var(--accent-orange)',
                    },
                },
            }}
        />
    );
};

export default ToastContainer;
