const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    createQuestion,
    getQuestionsByCategory,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    generateAndStoreQuestions
} = require('../controllers/questioncontroller');

router.post('/', auth, createQuestion);
router.get('/:topic', auth, getQuestionsByCategory);
router.get('/', auth, getQuestions);

router.post('/generate', auth, generateAndStoreQuestions);

module.exports = router;
