const db = require('../config/db.js');
const bcrypt = require('bcryptjs');

// Get the profile of the currently logged-in patient
exports.getPatientProfile = async (req, res) => {
    try {
        const patient = await db.query('SELECT id, name, email FROM patients WHERE id = $1', [req.user.id]);
        res.json(patient.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update the profile of the currently logged-in patient
exports.updatePatientProfile = async (req, res) => {
    const { name, password } = req.body;
    const patientId = req.user.id;

    try {
        // Build the query dynamically based on what the user wants to update
        let query;
        let queryParams;

        if (password) {
            // If the user is updating their password, hash it first
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query = 'UPDATE patients SET name = $1, password = $2 WHERE id = $3 RETURNING id, name, email';
            queryParams = [name, hashedPassword, patientId];
        } else {
            // If only updating the name
            query = 'UPDATE patients SET name = $1 WHERE id = $2 RETURNING id, name, email';
            queryParams = [name, patientId];
        }

        const updatedPatient = await db.query(query, queryParams);
        res.json(updatedPatient.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};