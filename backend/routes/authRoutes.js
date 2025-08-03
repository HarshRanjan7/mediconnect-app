// File Path: backend/routes/authRoutes.js

const express = require('express');
const router = express.Router(); // This line was likely missing or misplaced
const { 
    registerPatient, 
    loginPatient, 
    registerDoctor, 
    loginDoctor,
    forgotPassword,
    resetPassword
} = require('../controllers/authController.js');

// Register and Login routes
router.post('/register/patient', registerPatient);
router.post('/login/patient', loginPatient);
router.post('/register/doctor', registerDoctor);
router.post('/login/doctor', loginDoctor);

// Forgot and Reset Password Routes
router.post('/forgot-password/patient', (req, res) => forgotPassword(req, res, 'patient'));
router.post('/forgot-password/doctor', (req, res) => forgotPassword(req, res, 'doctor'));
router.post('/reset-password/patient/:token', (req, res) => resetPassword(req, res, 'patient'));
router.post('/reset-password/doctor/:token', (req, res) => resetPassword(req, res, 'doctor'));

module.exports = router;