
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const { bookAppointment, getMyAppointments, cancelAppointment, completeAppointment } = require('../controllers/appointmentsController.js');

// This line handles the POST request for booking
router.post('/', authMiddleware, bookAppointment);

// This handles GET requests for a user's appointments
router.get('/my', authMiddleware, getMyAppointments);

// This handles PUT requests to cancel an appointment
router.put('/:id/cancel', authMiddleware, cancelAppointment);

// NEW ROUTE to mark an appointment as completed
router.put('/:id/complete', authMiddleware, completeAppointment);

module.exports = router;
