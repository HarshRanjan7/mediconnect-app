// File Path: backend/controllers/reviewsController.js

const db = require('../config/db.js');

// Create a new review
exports.createReview = async (req, res) => {
    const { doctor_id, rating, comment } = req.body;
    const patient_id = req.user.id; // From the authenticated user

    try {
        // Optional: Check if the patient had a completed appointment with the doctor
        // This would require more complex logic to verify. For now, we'll allow it.

        const newReview = await db.query(
            'INSERT INTO reviews (doctor_id, patient_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [doctor_id, patient_id, rating, comment]
        );
        res.status(201).json(newReview.rows[0]);
    } catch (err) {
        // Handle the case where a user tries to review the same doctor twice
        if (err.code === '23505') {
            return res.status(400).json({ msg: 'You have already reviewed this doctor.' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all reviews for a specific doctor
exports.getReviewsForDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const reviews = await db.query(
            'SELECT r.rating, r.comment, r.created_at, p.name as patient_name FROM reviews r JOIN patients p ON r.patient_id = p.id WHERE r.doctor_id = $1 ORDER BY r.created_at DESC',
            [doctorId]
        );
        res.json(reviews.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
