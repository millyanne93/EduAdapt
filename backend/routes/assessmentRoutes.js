const express = require('express');
const router = express.Router();
const { 
    createAssessment,
    getAssessments,
    getAssessmentById,
    updateAssessment,
    deleteAssessment,
    getQuestionsForAssessment,
    createQuestionInAssessment,
    deleteQuestionFromAssessment
} = require('../controllers/assessmentcontroller');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuthMiddleware');

router.post('/', auth, adminAuth, createAssessment);
router.post('/:id/questions', auth, adminAuth, createQuestionInAssessment);
router.get('/', auth, getAssessments);
router.get('/:id', auth, getAssessmentById);
router.put('/:id', auth, adminAuth, updateAssessment);
router.delete('/:id', auth, adminAuth, deleteAssessment);
router.get('/:id/questions', auth, adminAuth, getQuestionsForAssessment);
router.delete('/:assessmentId/questions/:questionId', auth, adminAuth, deleteQuestionFromAssessment);

module.exports = router;
