import { useState } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('patient');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post(`/auth/forgot-password/${userType}`, { email });
            toast.success(res.data.msg);
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section__container py-12">
            <div className="w-full max-w-md mx-auto p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="font-outfit text-2xl font-bold text-center text-text-dark dark:text-white">Forgot Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">I am a:</label>
                        <select value={userType} onChange={e => setUserType(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700">
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter your email address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 text-white bg-primary rounded-md hover:bg-primary-dark disabled:bg-primary/70">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
}