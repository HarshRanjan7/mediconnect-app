// File Path: backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import all the route files
const authRoutes = require('./routes/authRoutes.js');
const doctorsRoutes = require('./routes/doctorsRoutes.js');
const appointmentsRoutes = require('./routes/appointmentsRoutes.js');
const reviewsRoutes = require('./routes/reviewsRoutes.js');
const patientsRoutes = require('./routes/patientsRoutes.js');

const documentsRoutes = require('./routes/documentsRoutes.js');


// Create the main Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes - This section tells the server how to handle requests
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/patients', patientsRoutes);

app.use('/uploads', express.static('uploads'));

app.use('/api/documents', documentsRoutes);
// Test Route
app.get('/', (req, res) => {
    res.send('MediConnect API is running...');
});

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
