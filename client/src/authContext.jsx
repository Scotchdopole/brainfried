import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from './userAuth';

const AuthContext = createContext();

const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID;
console.log('AuthContext.jsx: ADMIN_USER_ID loaded:', ADMIN_USER_ID);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const getAuthDataFromToken = (token) => {
        console.log('AuthContext.jsx: Attempting to get auth data from token:', token);
        if (!token) return { id: null, username: null };
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            console.log('AuthContext.jsx: Decoded payload in getAuthDataFromToken:', decoded);
            return { id: decoded.id, username: decoded.username };
        } catch (e) {
            console.error('AuthContext.jsx: Error decoding token in getAuthDataFromToken:', e);
            return { id: null, username: null };
        }
    };

    useEffect(() => {
        const checkAuthStatus = () => {
            console.log('AuthContext.jsx: checkAuthStatus called.');
            const token = localStorage.getItem('token');
            if (token) {
                const { id, username: userFromToken } = getAuthDataFromToken(token);
                console.log('AuthContext.jsx: checkAuthStatus - Extracted data from stored token:', { id, username: userFromToken });

                if (id && userFromToken) {
                    setIsLoggedIn(true);
                    setUserId(id);
                    setUsername(userFromToken);
                    setIsCurrentUserAdmin(id === ADMIN_USER_ID);
                    console.log('AuthContext.jsx: checkAuthStatus - isCurrentUserAdmin:', id === ADMIN_USER_ID);

                    localStorage.setItem('user', JSON.stringify({ id: id, username: userFromToken }));
                    console.log('AuthContext.jsx: checkAuthStatus - User is logged in from localStorage.');
                } else {
                    console.warn("AuthContext.jsx: checkAuthStatus - Token found but user ID or username could not be extracted. Logging out.");
                    logout();
                }
            } else {
                console.log('AuthContext.jsx: checkAuthStatus - No token found in localStorage.');
                setIsLoggedIn(false);
                setUserId(null);
                setUsername(null);
                setIsCurrentUserAdmin(false);
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (inputUsername, inputPassword) => {
        try {
            console.log('AuthContext.jsx: Login function called for:', inputUsername);
            const response = await auth.login(inputUsername, inputPassword);
            console.log('AuthContext.jsx: Response from auth.login:', response);

            if (response.payload && response.payload.token) {
                const { id, username: userFromToken } = getAuthDataFromToken(response.payload.token);
                console.log('AuthContext.jsx: Extracted data from token:', { id, username: userFromToken });

                if (id && userFromToken) {
                    setIsLoggedIn(true);
                    setUserId(id);
                    setUsername(userFromToken);
                    setIsCurrentUserAdmin(id === ADMIN_USER_ID);
                    console.log('AuthContext.jsx: Login - isCurrentUserAdmin:', id === ADMIN_USER_ID);

                    localStorage.setItem('user', JSON.stringify({ id: id, username: userFromToken }));
                    console.log('AuthContext.jsx: User logged in and data saved to localStorage.');
                } else {
                    console.error("AuthContext.jsx: Login successful but could not extract user ID or username from token payload.");
                    throw new Error("Login failed: Failed to parse user data from token.");
                }
            } else {
                console.error("AuthContext.jsx: Login response did not contain response.payload.token.");
                throw new Error("Login failed: No token received from backend.");
            }
            return response;
        } catch (error) {
            console.error('AuthContext.jsx: Login error caught:', error.response ? error.response.data : error.message);
            logout();
            throw error;
        }
    };

    const logout = () => {
        auth.logout();
        setIsLoggedIn(false);
        setUserId(null);
        setUsername(null);
        setIsCurrentUserAdmin(false);
    };

    const value = {
        isLoggedIn,
        userId,
        username,
        isCurrentUserAdmin,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};