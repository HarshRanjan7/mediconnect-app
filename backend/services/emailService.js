// File Path: backend/services/emailService.js

const nodemailer = require('nodemailer');

// Set up the email transporter using your .env credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send a booking confirmation email
exports.sendBookingConfirmation = (patientEmail, doctorName, appointmentDate, appointmentTime) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: patientEmail,
        subject: 'Appointment Confirmation - MediConnect',
        html: `
            <h2>Your Appointment is Confirmed!</h2>
            <p>Dear Patient,</p>
            <p>This is a confirmation that your appointment has been successfully booked.</p>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p>Thank you for choosing MediConnect!</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Confirmation email sent:', info.response);
        }
    });
};
exports.sendPasswordResetEmail = (userEmail, resetUrl) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Password Reset Request - MediConnect',
        html: `
            <h2>Password Reset Request</h2>
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste it into your browser to complete the process:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending password reset email:', error);
        } else {
            console.log('Password reset email sent:', info.response);
        }
    });
};