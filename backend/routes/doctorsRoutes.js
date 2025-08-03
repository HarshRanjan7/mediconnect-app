const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById } = require('../controllers/doctorsController.js');

// This route gets all doctors (with filters)
router.get('/', getAllDoctors);

// This route gets a single doctor by their ID
router.get('/:id', getDoctorById);

module.exports = router;