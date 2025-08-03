const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const { getPatientProfile, updatePatientProfile } = require('../controllers/patientsController.js');

// All routes here are protected and require a patient to be logged in
router.get('/me', authMiddleware, getPatientProfile);
router.put('/me', authMiddleware, updatePatientProfile);

module.exports = router;