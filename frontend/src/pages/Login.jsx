import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
    const [isPatient, setIsPatient] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userType = isPatient ? 'patient' : 'doctor';
            await login(email, password, userType);
            const from = location.state?.from?.pathname || `/${userType}-dashboard`;
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login failed:", error);
            alert(error.response?.data?.msg || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                    Login to your Account
                </h1>

                <div className="flex border-b">
                    <button
                        onClick={() => setIsPatient(true)}
                        className={`w-1/2 py-3 font-semibold transition-colors ${isPatient ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Patient
                    </button>
                    <button
                        onClick={() => setIsPatient(false)}
                        className={`w-1/2 py-3 font-semibold transition-colors ${!isPatient ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Doctor
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div />
                        <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/70"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-secondary hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
