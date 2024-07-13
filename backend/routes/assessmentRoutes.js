const express = require('express');
const router = express.Router();
const { createAssessment, getAssessments, getAssessmentById } = require('../controllers/assessmentcontroller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createAssessment);
router.get('/', auth, getAssessments);
router.get('/:id', auth, getAssessmentById);

module.exports = router;
