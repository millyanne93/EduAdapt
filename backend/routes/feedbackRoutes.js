const express = require('express');
const router = express.Router();
const { createFeedback, getFeedbackForStudent } = require('../controllers/feedbackcontroller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createFeedback);
router.get('/student/:studentId', auth, getFeedbackForStudent);

module.exports = router;
