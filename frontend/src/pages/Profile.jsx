// File Path: frontend/src/pages/Profile.jsx

import { useState, useEffect } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner.jsx';

export default function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/patients/me');
                setName(res.data.name);
                setEmail(res.data.email);
            } catch (error) {
                toast.error('Could not load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const updateData = { name };
            if (password) {
                updateData.password = password;
            }
            await api.put('/patients/me', updateData);
            toast.success('Profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error('Failed to update profile.');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="section__container py-8">
            <div className="w-full max-w-lg mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="font-poppins text-2xl font-bold text-center text-text-dark">My Profile</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" value={email} disabled className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 text-white bg-primary rounded-md hover:bg-primary-dark">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}