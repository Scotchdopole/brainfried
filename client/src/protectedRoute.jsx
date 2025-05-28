
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContext';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ requiredAdmin = false }) => {
    const { isLoggedIn, isCurrentUserAdmin, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!isLoggedIn) {
        toast.error("You need to log in to access this page.", {
            style: {
                borderRadius: '10px',
                background: '#191e24',
                color: '#fff',
            },
            position: "top-center",
            duration: 3000
        });
        return <Navigate to="/login" replace />;
    }

    if (requiredAdmin && !isCurrentUserAdmin) {
        toast.error("You do not have administrative access to this page.", {
            style: {
                borderRadius: '10px',
                background: '#191e24',
                color: '#fff',
            },
            position: "top-center",
            duration: 3000
        });
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;