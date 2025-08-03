const db = require('../config/db.js');

// Upload a document for an appointment
exports.uploadDocument = async (req, res) => {
    try {
        const { appointment_id, document_type } = req.body;
        const { id: doctorId } = req.user;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ msg: 'No file uploaded.' });
        }

        // Get patient_id from the appointment
        const appointmentRes = await db.query('SELECT patient_id FROM appointments WHERE id = $1', [appointment_id]);
        if (appointmentRes.rows.length === 0) {
            return res.status(404).json({ msg: 'Appointment not found.' });
        }
        const patient_id = appointmentRes.rows[0].patient_id;

        // In a real app, file.path would be a URL from AWS S3 or Firebase Storage
        const newDocument = await db.query(
            'INSERT INTO documents (appointment_id, patient_id, doctor_id, file_name, file_path, document_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [appointment_id, patient_id, doctorId, file.originalname, file.path, document_type]
        );

        res.status(201).json(newDocument.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all documents for a specific appointment
exports.getDocumentsForAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const documents = await db.query('SELECT * FROM documents WHERE appointment_id = $1', [appointmentId]);
        res.json(documents.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};