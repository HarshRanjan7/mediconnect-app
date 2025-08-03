// File Path: backend/routes/reviewsRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const { createReview, getReviewsForDoctor } = require('../controllers/reviewsController.js');

// POST a new review (requires patient to be logged in)
router.post('/', authMiddleware, createReview);

// GET all reviews for a specific doctor (publicly accessible)
router.get('/doctor/:doctorId', getReviewsForDoctor);

module.exports = router;
