// File Path: frontend/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-extra-light/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50">
            <nav className="section__container py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-outfit font-bold text-primary">
                    Medi<span>Connect</span>
                </Link>
                <ul className="hidden md:flex items-center space-x-8 text-text-dark dark:text-extra-light">
                    <li><Link to="/doctors" className="font-semibold hover:text-primary transition-colors">Find Doctors</Link></li>
                    {/* --- NEW LINKS ADDED HERE --- */}
                    <li><Link to="/blog" className="font-semibold hover:text-primary transition-colors">Blog</Link></li>
                    <li><Link to="/self-assessment" className="font-semibold hover:text-primary transition-colors">Wellness Check</Link></li>
                    {/* --- END OF NEW LINKS --- */}
                    {user && user.type === 'patient' && (
                        <li><Link to="/profile" className="font-semibold hover:text-primary">My Profile</Link></li>
                    )}
                    {user && <li><Link to={`/${user.type}-dashboard`} className="font-semibold hover:text-primary transition-colors">Dashboard</Link></li>}
                </ul>

                <div className="flex items-center space-x-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        {theme === 'light' ? <Moon className="text-text-dark" /> : <Sun className="text-yellow-400" />}
                    </button>
                    {user ? (
                        <button onClick={handleLogout} className="hidden md:block px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="hidden md:block px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};