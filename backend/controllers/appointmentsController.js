// File Path: backend/controllers/appointmentsController.js

const db = require('../config/db.js');
const { sendBookingConfirmation } = require('../services/emailService.js'); // Email service

// 📌 Book a new appointment
exports.bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;
    const patient_id = req.user.id;

    try {
        // Check if slot already booked and not cancelled
        const existingAppointment = await db.query(
            'SELECT * FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 AND status != $4',
            [doctor_id, appointment_date, appointment_time, 'cancelled']
        );

        if (existingAppointment.rows.length > 0) {
            return res.status(400).json({ msg: 'This time slot is already booked.' });
        }

        // Insert new appointment
        const newAppointment = await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [patient_id, doctor_id, appointment_date, appointment_time, reason]
        );

        // Get email and doctor details for sending confirmation
        const patientResult = await db.query('SELECT email FROM patients WHERE id = $1', [patient_id]);
        const doctorResult = await db.query('SELECT name FROM doctors WHERE id = $1', [doctor_id]);

        if (patientResult.rows.length > 0 && doctorResult.rows.length > 0) {
            const patientEmail = patientResult.rows[0].email;
            const doctorName = doctorResult.rows[0].name;
            await sendBookingConfirmation(patientEmail, doctorName, appointment_date, appointment_time);
        }

        res.status(201).json(newAppointment.rows[0]);
    } catch (err) {
        console.error('Book Appointment Error:', err.message);
        res.status(500).send('Server Error');
    }
};

// 📌 Get all appointments for the logged-in user
exports.getMyAppointments = async (req, res) => {
    try {
        const user = req.user;
        let query;

        if (user.type === 'doctor') {
            query = `
                SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason, p.name as patient_name
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                WHERE a.doctor_id = $1
                ORDER BY a.appointment_date, a.appointment_time
            `;
        } else {
            query = `
                SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason,
                       d.id as doctor_id, d.name as doctor_name, d.clinic_name, d.location
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                WHERE a.patient_id = $1
                ORDER BY a.appointment_date, a.appointment_time
            `;
        }

        const appointments = await db.query(query, [user.id]);
        res.json(appointments.rows);
    } catch (err) {
        console.error('Get Appointments Error:', err.message);
        res.status(500).send('Server Error');
    }
};

// 📌 Cancel an appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId, type: userType } = req.user;

        const result = await db.query('SELECT * FROM appointments WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Appointment not found.' });
        }

        const appointment = result.rows[0];

        if (userType === 'patient' && appointment.patient_id !== userId) {
            return res.status(403).json({ msg: 'Not authorized to cancel this appointment.' });
        }

        const updatedAppointment = await db.query(
            "UPDATE appointments SET status = 'cancelled' WHERE id = $1 RETURNING *",
            [id]
        );

        res.json(updatedAppointment.rows[0]);
    } catch (err) {
        console.error('Cancel Appointment Error:', err.message);
        res.status(500).send('Server Error');
    }
};

// 📌 Mark appointment as completed (Doctor only)
exports.completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: doctorId, type: userType } = req.user;

        if (userType !== 'doctor') {
            return res.status(403).json({ msg: 'Only doctors can complete appointments.' });
        }

        const result = await db.query('SELECT * FROM appointments WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Appointment not found.' });
        }

        const appointment = result.rows[0];

        if (appointment.doctor_id !== doctorId) {
            return res.status(403).json({ msg: 'Not authorized to complete this appointment.' });
        }

        const updatedAppointment = await db.query(
            "UPDATE appointments SET status = 'completed' WHERE id = $1 RETURNING *",
            [id]
        );

        res.json(updatedAppointment.rows[0]);
    } catch (err) {
        console.error('Complete Appointment Error:', err.message);
        res.status(500).send('Server Error');
    }
};
