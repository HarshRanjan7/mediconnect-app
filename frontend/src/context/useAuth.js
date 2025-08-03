// --- src/hooks/useAuth.js ---
import { useContext } from 'react';
import { AuthContext } from './authContext';

export const useAuth = () => {
    return useContext(AuthContext);
};
