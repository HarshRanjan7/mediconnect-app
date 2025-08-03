// File Path: backend/controllers/authController.js

const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // This line has been corrected
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService.js');

// --- Register a User ---
const registerUser = async (req, res, userType) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await db.query(`SELECT * FROM ${userType}s WHERE email = $1`, [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            `INSERT INTO ${userType}s (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        const payload = { user: { id: newUser.rows[0].id, type: userType, name: newUser.rows[0].name } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// --- Login a User ---
const loginUser = async (req, res, userType) => {
    const { email, password } = req.body;
    try {
        const userResult = await db.query(`SELECT * FROM ${userType}s WHERE email = $1`, [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }
        
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

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

// --- Forgot Password ---
const forgotPassword = async (req, res, userType) => {
    try {
        const { email } = req.body;
        const userResult = await db.query(`SELECT * FROM ${userType}s WHERE email = $1`, [email]);

        if (userResult.rows.length === 0) {
            return res.status(200).json({ msg: 'If a user with that email exists, a password reset link has been sent.' });
        }

        const user = userResult.rows[0];
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await db.query(
            `UPDATE ${userType}s SET reset_password_token = $1, reset_password_expires = to_timestamp($2 / 1000.0) WHERE id = $3`,
            [resetToken, resetPasswordExpires, user.id]
        );

        const resetUrl = `http://localhost:5173/#/reset-password/${userType}/${resetToken}`;
        sendPasswordResetEmail(user.email, resetUrl);
        
        res.status(200).json({ msg: 'If a user with that email exists, a password reset link has been sent.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Reset Password ---
const resetPassword = async (req, res, userType) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const userResult = await db.query(
            `SELECT * FROM ${userType}s WHERE reset_password_token = $1 AND reset_password_expires > NOW()`,
            [token]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
        }

        const user = userResult.rows[0];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            `UPDATE ${userType}s SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2`,
            [hashedPassword, user.id]
        );

        res.status(200).json({ msg: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Export all the functions for the routes
exports.registerPatient = (req, res) => registerUser(req, res, 'patient');
exports.loginPatient = (req, res) => loginUser(req, res, 'patient');
exports.registerDoctor = (req, res) => registerUser(req, res, 'doctor');
exports.loginDoctor = (req, res) => loginUser(req, res, 'doctor');
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;