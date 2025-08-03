import { useState, useEffect } from 'react';
import { Calendar, Stethoscope, Clock, UserCheck } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../services/api.js';
import Spinner from '../components/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import StarRating from '../components/StarRating.jsx';

// ---------------------- Review Modal ----------------------
const ReviewModal = ({ doctorId, onClose, onReviewSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a star rating.');
            return;
        }
        try {
            await api.post('/reviews', { doctor_id: doctorId, rating, comment });
            toast.success('Thank you for your review!');
            onReviewSubmit();
            onClose();
        } catch (error) {
            console.error('Failed to submit review:', error);
            toast.error(error.response?.data?.msg || 'Failed to submit review.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="font-poppins text-2xl font-bold mb-4">Leave a Review</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <p className="font-semibold mb-2">Your Rating:</p>
                        <StarRating rating={rating} onRatingChange={setRating} />
                    </div>
                    <div className="mb-6">
                        <label className="font-semibold mb-2 block">Your Comments:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            className="w-full p-2 border rounded-md"
                            placeholder="Share your experience..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Submit Review</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ---------------------- Documents Modal ----------------------
const DocumentsModal = ({ appointmentId, onClose }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await api.get(`/documents/appointment/${appointmentId}`);
                setDocuments(res.data);
            } catch (error) {
                toast.error('Could not load documents.');
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [appointmentId]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="font-outfit text-2xl font-bold mb-4 text-text-dark dark:text-white">View Documents</h2>
                {loading ? <Spinner /> : (
                    <ul className="space-y-2">
                        {documents.length > 0 ? documents.map(doc => (
                            <li key={doc.id}>
                                <a 
                                    href={`http://localhost:5000/${doc.file_path}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {doc.file_name} ({doc.document_type})
                                </a>
                            </li>
                        )) : <p>No documents found for this appointment.</p>}
                    </ul>
                )}
                <button onClick={onClose} className="mt-6 w-full py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Close</button>
            </div>
        </div>
    );
};

// ---------------------- Patient Dashboard ----------------------
export default function PatientDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments/my');
            setAppointments(res.data);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.put(`/appointments/${appointmentId}/cancel`);
                toast.success('Appointment cancelled successfully.');
                fetchAppointments();
            } catch (error) {
                console.error('Failed to cancel appointment:', error);
                toast.error('Could not cancel the appointment.');
            }
        }
    };

    const openReviewModal = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setShowReviewModal(true);
    };

    const openDocumentsModal = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowDocumentsModal(true);
    };

    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'Upcoming') return app.status === 'scheduled';
        if (activeTab === 'Completed') return app.status === 'completed';
        if (activeTab === 'Cancelled') return app.status === 'cancelled';
        return true;
    });

    const upcomingAppointments = appointments
        .filter(app => app.status === 'scheduled' && new Date(app.appointment_date) >= new Date())
        .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

    const nextAppointment = upcomingAppointments[0];

    if (loading) return <Spinner />;

    return (
        <div className="section__container py-8">
            {/* Welcome and Next Appointment */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="font-outfit text-3xl font-bold text-text-dark dark:text-white">
                    Welcome back, {user?.name}!
                </h1>
                {nextAppointment ? (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-blue-500 rounded-lg">
                        <div className="flex items-center mb-4">
                            <Clock className="w-6 h-6 text-primary mr-3" />
                            <p className="font-semibold text-text-dark dark:text-gray-200">
                                Your next appointment is {formatDistanceToNow(new Date(nextAppointment.appointment_date), { addSuffix: true })}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-inner">
                            <p className="text-lg text-primary font-bold">
                                {format(new Date(nextAppointment.appointment_date), 'EEEE, MMMM do')} at {nextAppointment.appointment_time}
                            </p>
                            <p className="text-sm text-text-light flex items-center mt-1">
                                <UserCheck className="w-4 h-4 mr-2" />
                                with {nextAppointment.doctor_name}
                            </p>
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <button onClick={() => alert('Reschedule feature coming soon!')} className="px-4 py-2 text-sm bg-secondary text-white font-semibold rounded-md hover:bg-teal-600">Reschedule</button>
                            <button onClick={() => handleCancel(nextAppointment.id)} className="px-4 py-2 text-sm bg-red-500 text-white font-semibold rounded-md hover:bg-red-600">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-gray-700 border border-green-200 dark:border-green-500 rounded-lg">
                        <p className="text-text-dark dark:text-gray-200">You have no upcoming appointments. Time to book a check-up?</p>
                        <Link to="/doctors" className="inline-block mt-2 px-4 py-2 text-sm bg-primary text-white font-semibold rounded-md hover:bg-primary-dark">Find a Doctor</Link>
                    </div>
                )}
            </div>

            {/* Appointment Tabs */}
            <h2 className="font-outfit text-2xl font-bold text-text-dark mb-4">Your Appointment History</h2>
            <div className="flex border-b mb-4">
                {['Upcoming', 'Completed', 'Cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-semibold ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-text-light'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Appointment List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {filteredAppointments.length > 0 ? filteredAppointments.map(app => (
                        <li key={app.id} className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <div className="flex items-center text-lg font-semibold text-text-dark">
                                        <Calendar className="w-5 h-5 mr-2 text-secondary" />
                                        {new Date(app.appointment_date).toDateString()} at {app.appointment_time}
                                    </div>
                                    <p className="text-text-light mt-1 flex items-center">
                                        <Stethoscope className="w-5 h-5 mr-2 text-gray-400" />
                                        With {app.doctor_name} at {app.clinic_name}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                                        app.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                        app.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                        app.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                    {app.status === 'scheduled' && (
                                        <button
                                            onClick={() => handleCancel(app.id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {app.status === 'completed' && (
                                        <>
                                            <button
                                                onClick={() => openReviewModal(app.doctor_id)}
                                                className="px-3 py-1 bg-secondary text-white text-sm font-semibold rounded-md hover:bg-blue-700"
                                            >
                                                Leave a Review
                                            </button>
                                            <button
                                                onClick={() => openDocumentsModal(app.id)}
                                                className="px-3 py-1 bg-gray-500 text-white text-sm font-semibold rounded-md hover:bg-gray-600"
                                            >
                                                View Documents
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    )) : (
                        <p className="p-6 text-center text-gray-500">You have no {activeTab.toLowerCase()} appointments.</p>
                    )}
                </ul>
            </div>

            {/* Modals */}
            {showReviewModal && (
                <ReviewModal
                    doctorId={selectedDoctorId}
                    onClose={() => setShowReviewModal(false)}
                    onReviewSubmit={fetchAppointments}
                />
            )}
            {showDocumentsModal && (
                <DocumentsModal 
                    appointmentId={selectedAppointmentId} 
                    onClose={() => setShowDocumentsModal(false)} 
                />
            )}
        </div>
    );
}
