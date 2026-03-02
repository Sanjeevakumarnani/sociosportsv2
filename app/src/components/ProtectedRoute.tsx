import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);

            if (payload.exp && payload.exp * 1000 < Date.now()) {
                console.warn('Token expired, redirecting to login');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error('Invalid token format', error);
            localStorage.removeItem('adminToken');
            setIsAuthorized(false);
        }
    }, [token]);

    if (isAuthorized === null) {
        return null; // Or a loading spinner
    }

    if (isAuthorized === false) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
