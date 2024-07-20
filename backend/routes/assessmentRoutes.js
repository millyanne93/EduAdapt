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

router.post('/', auth, createAssessment);
router.post('/:id/questions', auth, createQuestionInAssessment);
router.get('/', auth, getAssessments);
router.get('/:id', auth, getAssessmentById);
router.put('/:id', auth, updateAssessment);
router.delete('/:id', auth, deleteAssessment);
router.get('/:id/questions', auth, getQuestionsForAssessment);
router.delete('/:assessmentId/questions/:questionId', auth, deleteQuestionFromAssessment)

module.exports = router;
