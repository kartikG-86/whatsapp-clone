import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" />;
    }

    // Render the nested routes if authenticated
    return <Outlet />;
};

export default PrivateRoute;
