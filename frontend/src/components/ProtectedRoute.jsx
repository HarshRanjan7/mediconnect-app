import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// This component also needs to be the "default" export
export default function ProtectedRoute({ children, userType }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="text-center py-10">Loading user session...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (user.type !== userType) {
        return <Navigate to={`/${user.type}-dashboard`} replace />;
    }

    return children;
};