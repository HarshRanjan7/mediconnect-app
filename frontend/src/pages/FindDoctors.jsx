// File Path: frontend/src/pages/FindDoctors.jsx

import { useState, useEffect } from 'react';
import DoctorCard from '../components/DoctorCard.jsx';
import api from '../services/api.js';
import SkeletonCard from '../components/SkeletonCard.jsx'; // Import the new component

export default function FindDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ... (keep the existing state for filters)
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [sort, setSort] = useState('');
    const [locations, setLocations] = useState([]);
    const [specializations, setSpecializations] = useState([]);

    useEffect(() => {
        const fetchDoctorsAndFilters = async () => {
            setLoading(true);
            try {
                // ... (keep the existing API call logic)
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (location) params.append('location', location);
                if (specialization) params.append('specialization', specialization);
                if (sort) params.append('sort', sort);

                const res = await api.get(`/doctors?${params.toString()}`);
                setDoctors(res.data);

                if (locations.length === 0) {
                    const allDocsRes = await api.get('/doctors');
                    const uniqueLocations = [...new Set(allDocsRes.data.map(doc => doc.location))];
                    const uniqueSpecs = [...new Set(allDocsRes.data.map(doc => doc.specialization))];
                    setLocations(uniqueLocations);
                    setSpecializations(uniqueSpecs);
                }
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorsAndFilters();
    }, [searchTerm, location, specialization, sort]);

    return (
        <div className="section__container py-8">
            <h1 className="font-outfit text-3xl font-bold text-text-dark mb-6">Find a Doctor</h1>
            
            {/* ... (keep the filter controls) */}
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    // Show 6 skeleton cards while loading
                    Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
                ) : (
                    doctors.length > 0 ? doctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    )) : <p className="text-center text-gray-500 col-span-full">No doctors found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};
