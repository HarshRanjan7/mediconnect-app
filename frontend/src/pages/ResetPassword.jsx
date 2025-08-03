import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const { userType, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match.');
        }
        setLoading(true);
        try {
            const res = await api.post(`/auth/reset-password/${userType}/${token}`, { password });
            toast.success(res.data.msg);
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section__container py-12">
            <div className="w-full max-w-md mx-auto p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="font-outfit text-2xl font-bold text-center text-text-dark dark:text-white">Reset Your Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 text-white bg-primary rounded-md hover:bg-primary-dark disabled:bg-primary/70">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}