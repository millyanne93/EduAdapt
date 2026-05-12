const express = require('express');
const router = express.Router();
const { processUploadedFile } = require('../controllers/uploadcontroller');
const upload = require('../middleware/uploadMiddleware');  // Middleware for handling file uploads
const auth = require('../middleware/authMiddleware');

router.post('/upload', auth, upload.single('file'), processUploadedFile);

module.exports = router;
