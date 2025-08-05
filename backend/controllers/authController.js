// File Path: backend/controllers/authController.js

const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService.js');

// --- Reusable function to register a user ---
const registerUser = async (req, res, userType) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await db.query(`SELECT * FROM ${userType}s WHERE email = $1`, [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            `INSERT INTO ${userType}s (name, email, password) VALUES ($1, $2, $3)`,
            [name, email, hashedPassword]
        );
        
        // We don't log the user in automatically after signup for security.
        res.status(201).json({ msg: 'User registered successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// --- Reusable function to log in a user ---
const loginUser = async (req, res, userType) => {
    const { email, password } = req.body;
    try {
        const userResult = await db.query(`SELECT * FROM ${userType}s WHERE email = $1`, [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }
        
        const user = userResult.rows[0];
        
        // This is the critical part: comparing the plain password with the hashed one.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        // If passwords match, create and send the login token.
        const payload = { user: { id: user.id, type: userType, name: user.name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// --- Forgot and Reset Password (keep these as they are) ---
const forgotPassword = async (req, res, userType) => {
    // ... (existing forgotPassword logic)
};
const resetPassword = async (req, res, userType) => {
    // ... (existing resetPassword logic)
};


// Export all the functions for the routes
exports.registerPatient = (req, res) => registerUser(req, res, 'patient');
exports.loginPatient = (req, res) => loginUser(req, res, 'patient');
exports.registerDoctor = (req, res) => registerUser(req, res, 'doctor');
exports.loginDoctor = (req, res) => loginUser(req, res, 'doctor');
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;