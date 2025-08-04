// File Path: frontend/src/pages/FindDoctors.jsx

import { useState, useEffect } from 'react';
import DoctorCard from '../components/DoctorCard.jsx';
import api from '../services/api.js';
import SkeletonCard from '../components/SkeletonCard.jsx';

export default function FindDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State for all filters
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [sort, setSort] = useState('');

    // State for populating dropdowns
    const [locations, setLocations] = useState([]);
    const [specializations, setSpecializations] = useState([]);

    useEffect(() => {
        const fetchDoctorsAndFilters = async () => {
            setLoading(true);
            try {
                // Construct the query string for the API call
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (location) params.append('location', location);
                if (specialization) params.append('specialization', specialization);
                if (sort) params.append('sort', sort);

                const res = await api.get(`/doctors?${params.toString()}`);
                setDoctors(res.data);

                // If this is the first load, populate the filter dropdowns
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
    }, [searchTerm, location, specialization, sort]); // Re-fetch whenever a filter changes

    return (
        <div className="section__container py-8">
            <h1 className="font-outfit text-3xl font-bold text-text-dark dark:text-white mb-6">Find a Doctor</h1>
            
            {/* Filter and Sort Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Location Dropdown */}
                <select value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white">
                    <option value="">All Locations</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                {/* Specialization Dropdown */}
                <select value={specialization} onChange={e => setSpecialization(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white">
                    <option value="">All Specializations</option>
                    {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                </select>
                {/* Sort Dropdown */}
                <select value={sort} onChange={e => setSort(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white">
                    <option value="">Sort By</option>
                    <option value="rating">Highest Rated</option>
                    <option value="experience">Most Experienced</option>
                </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
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
