const db = require('../config/db.js');

// Get all doctors, with filtering and sorting
exports.getAllDoctors = async (req, res) => {
    const { search, location, specialization, sort } = req.query;
    
    try {
        let query = `
            SELECT 
                d.id, d.name, d.specialization, d.experience, d.location, d.clinic_name, d.profile_picture_url,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as review_count
            FROM doctors d
            LEFT JOIN reviews r ON d.id = r.doctor_id
            WHERE 1=1 
        `;
        const queryParams = [];
        let paramIndex = 1;

        if (search) {
            query += ` AND (d.name ILIKE $${paramIndex} OR d.specialization ILIKE $${paramIndex})`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }
        if (location) {
            query += ` AND d.location = $${paramIndex}`;
            queryParams.push(location);
            paramIndex++;
        }
        if (specialization) {
            query += ` AND d.specialization = $${paramIndex}`;
            queryParams.push(specialization);
            paramIndex++;
        }
        
        query += ' GROUP BY d.id';

        if (sort === 'experience') {
            query += ' ORDER BY d.experience DESC';
        } else if (sort === 'rating') {
            query += ' ORDER BY average_rating DESC';
        } else {
            query += ' ORDER BY d.name ASC';
        }

        const doctors = await db.query(query, queryParams);
        res.json(doctors.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a single doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
         const doctorQuery = `
            SELECT 
                d.id, d.name, d.specialization, d.experience, d.location, d.clinic_name, d.bio, d.profile_picture_url,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as review_count
            FROM doctors d
            LEFT JOIN reviews r ON d.id = r.doctor_id
            WHERE d.id = $1
            GROUP BY d.id
        `;
        const doctor = await db.query(doctorQuery, [req.params.id]);
        
        if (doctor.rows.length === 0) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        res.json(doctor.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};