const express = require('express');
const router = express.Router();
const { createAssessment, getAssessments } = require('../controllers/assessmentcontroller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createAssessment);
router.get('/', auth, getAssessments);

module.exports = router;
