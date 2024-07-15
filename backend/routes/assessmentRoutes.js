const express = require('express');
const router = express.Router();
const { 
    createAssessment,
    getAssessments,
    getAssessmentById,
    updateAssessment,
    deleteAssessment
} = require('../controllers/assessmentcontroller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createAssessment);
router.get('/', auth, getAssessments);
router.get('/:id', auth, getAssessmentById);
router.put('/:id', auth, updateAssessment);
router.delete('/:id', auth, deleteAssessment)

module.exports = router;
