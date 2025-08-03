// File Path: frontend/src/pages/DoctorProfile.jsx

import { useState, useEffect } from 'react'; // This line has been corrected
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import StarRating from '../components/StarRating.jsx';
import Spinner from '../components/Spinner.jsx';
import toast from 'react-hot-toast';

export default function DoctorProfile() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        const fetchDoctorAndReviews = async () => {
            setLoading(true);
            try {
                const [doctorRes, reviewsRes] = await Promise.all([
                    api.get(`/doctors/${id}`),
                    api.get(`/reviews/doctor/${id}`)
                ]);
                setDoctor(doctorRes.data);
                setReviews(reviewsRes.data);
            } catch (error) {
                console.error("Failed to fetch doctor details or reviews:", error);
                toast.error("Could not load doctor's profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorAndReviews();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please log in to book an appointment.');
            navigate('/login', { state: { from: location } });
            return;
        }
        if (user.type !== 'patient') {
            toast.error('Only patients can book appointments.');
            return;
        }
        if (!selectedTime) {
            toast.error('Please select a time slot.');
            return;
        }
        try {
            await api.post('/appointments', {
                doctor_id: doctor.id,
                appointment_date: selectedDate,
                appointment_time: selectedTime,
                reason: 'Consultation'
            });
            toast.success('Appointment booked successfully!');
            navigate('/patient-dashboard');
        } catch (error) {
            console.error('Booking failed:', error);
            toast.error(error.response?.data?.msg || 'Booking failed.');
        }
    };

    if (loading) return <Spinner />;
    if (!doctor) return <p className="text-center py-10 text-red-500">Doctor not found.</p>;

    const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    return (
        <div className="section__container py-8">
            <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 text-center">
                        <img src={doctor.profile_picture_url} alt={doctor.name} className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-blue-200" />
                        <h1 className="text-3xl font-bold mt-4">{doctor.name}</h1>
                        <p className="text-xl text-blue-600 font-semibold">{doctor.specialization}</p>
                        <div className="flex items-center justify-center mt-2">
                            <StarRating rating={parseFloat(doctor.average_rating)} />
                            <span className="text-sm text-gray-500 ml-2">({doctor.review_count} reviews)</span>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <h2 className="font-poppins text-2xl font-semibold border-b pb-2 mb-4">About</h2>
                        <p className="text-text-light mb-6">{doctor.bio}</p>
                        
                        <h2 className="font-poppins text-2xl font-semibold border-b pb-2 mb-4">Book an Appointment</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="font-semibold text-gray-700">Select Date:</label>
                                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="ml-2 p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Select Time:</label>
                                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {availableTimes.map(time => (
                                        <button 
                                            key={time} 
                                            onClick={() => setSelectedTime(time)}
                                            className={`p-2 border rounded-lg text-center transition-colors ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-100'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleBooking} className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors mt-4">
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="font-poppins text-2xl font-semibold border-b pb-2 mb-4">Patient Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <div key={index} className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-text-dark">{review.patient_name}</p>
                                    <span className="text-xs text-text-light">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="my-2">
                                    <StarRating rating={review.rating} />
                                </div>
                                <p className="text-text-light">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-text-light">This doctor has no reviews yet.</p>
                )}
            </div>
        </div>
    );
};
