import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Star } from 'lucide-react';
import StarRating from './StarRating.jsx';

export default function DoctorCard({ doctor }) {
    return (
        // Added group for hover effects and a more pronounced shadow
        <div className="group bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
            <div className="p-6">
                <div className="flex items-center space-x-4">
                    <img src={doctor.profile_picture_url || '[https://placehold.co/100x100/E2E8F0/4A5568?text=Doc](https://placehold.co/100x100/E2E8F0/4A5568?text=Doc)'} alt={doctor.name} className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 group-hover:border-primary transition-colors duration-300" />
                    <div>
                        <h3 className="font-outfit text-xl font-bold text-text-dark">{doctor.name}</h3>
                        <p className="text-secondary font-semibold">{doctor.specialization}</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2 text-text-light text-sm">
                    <div className="flex items-center"><Briefcase className="w-5 h-5 mr-2 text-gray-400" /><span>{doctor.experience} years experience</span></div>
                    <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-gray-400" /><span>{doctor.location} &bull; {doctor.clinic_name}</span></div>
                    <div className="flex items-center pt-1">
                        <StarRating rating={parseFloat(doctor.average_rating)} size={18} />
                        <span className="text-xs text-gray-500 ml-2">({doctor.review_count} reviews)</span>
                    </div>
                </div>
                <div className="mt-6">
                    <Link to={`/doctors/${doctor.id}`} className="block w-full text-center bg-primary text-white py-2.5 rounded-lg font-bold group-hover:bg-primary-dark transition-colors duration-300">
                        View Profile & Book
                    </Link>
                </div>
            </div>
        </div>
    );
};
