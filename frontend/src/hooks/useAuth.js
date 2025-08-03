import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// This is a "named" export, which is why it's imported with { useAuth }
export const useAuth = () => {
    return useContext(AuthContext);
};