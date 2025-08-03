// File Path: frontend/src/context/AuthContext.jsx

import { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUserFromToken = useCallback(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded.user);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadUserFromToken();
    }, [loadUserFromToken]);

    const login = async (email, password, userType) => {
        const res = await api.post(`/auth/login/${userType}`, { email, password });
        localStorage.setItem('token', res.data.token);
        loadUserFromToken();
    };

    // NEW SIGNUP FUNCTION
    const signup = async (name, email, password, userType) => {
        await api.post(`/auth/register/${userType}`, { name, email, password });
        // After signup, the user is not logged in automatically.
        // They will be redirected to the login page.
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Add 'signup' to the context value
    const authContextValue = { user, login, signup, logout, loading };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
