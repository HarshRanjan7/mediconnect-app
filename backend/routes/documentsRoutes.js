const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware.js');
const { uploadDocument, getDocumentsForAppointment } = require('../controllers/documentsController.js');

// Setup multer for file storage
// NOTE: For a real production app, use a cloud storage solution like AWS S3.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure you have an 'uploads' folder in your backend directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// POST a new document (requires doctor to be logged in)
router.post('/upload', [authMiddleware, upload.single('document')], uploadDocument);

// GET all documents for an appointment (requires user to be logged in)
router.get('/appointment/:appointmentId', authMiddleware, getDocumentsForAppointment);

module.exports = router;