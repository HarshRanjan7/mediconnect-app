// File Path: frontend/src/pages/DoctorDashboard.jsx

import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { Calendar, User } from 'lucide-react';
import Spinner from '../components/Spinner.jsx';
import toast from 'react-hot-toast';

// UploadModal Component
const UploadModal = ({ appointmentId, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState('prescription');
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a file.');

        const formData = new FormData();
        formData.append('document', file);
        formData.append('appointment_id', appointmentId);
        formData.append('document_type', documentType);

        setLoading(true);
        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Document uploaded successfully!');
            onUploadSuccess();
            onClose();
        } catch (error) {
            toast.error('File upload failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="font-outfit text-2xl font-bold mb-4 text-text-dark dark:text-white">Upload Document</h2>
                <form onSubmit={handleUpload}>
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])}
                        className="mb-4 w-full text-sm"
                    />
                    <select 
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="mb-4 w-full p-2 border rounded"
                    >
                        <option value="prescription">Prescription</option>
                        <option value="report">Medical Report</option>
                    </select>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Component
export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/appointments/my');
            setAppointments(res.data);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (appointmentId) => {
        try {
            await api.put(`/appointments/${appointmentId}/complete`);
            toast.success('Appointment marked as complete.');
            fetchAppointments();
        } catch (error) {
            toast.error('Failed to update appointment.');
        }
    };

    const openUploadModal = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowUploadModal(true);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="section__container py-8">
            <h1 className="font-outfit text-3xl font-bold text-text-dark mb-6">Your Appointments</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {appointments.length > 0 ? appointments.map(app => (
                        <li key={app.id} className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <div className="flex items-center text-lg font-semibold text-text-dark">
                                        <Calendar className="w-5 h-5 mr-2 text-primary" />
                                        {new Date(app.appointment_date).toDateString()} at {app.appointment_time}
                                    </div>
                                    <p className="text-text-light mt-1 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-gray-400" />
                                        With patient: {app.patient_name}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                                        app.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                                        app.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        app.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                    {app.status === 'scheduled' && (
                                        <button 
                                            onClick={() => handleComplete(app.id)}
                                            className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600"
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                    {app.status === 'completed' && (
                                        <button 
                                            onClick={() => openUploadModal(app.id)}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600"
                                        >
                                            Upload Prescription
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    )) : (
                        <p className="p-6 text-center text-gray-500">You have no appointments.</p>
                    )}
                </ul>
            </div>

            {showUploadModal && (
                <UploadModal 
                    appointmentId={selectedAppointmentId}
                    onClose={() => setShowUploadModal(false)}
                    onUploadSuccess={fetchAppointments}
                />
            )}
        </div>
    );
}
