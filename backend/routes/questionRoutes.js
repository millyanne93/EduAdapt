const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    createQuestion,
    getQuestionsByCategory,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questioncontroller');

router.post('/', auth, createQuestion);
router.get('/', auth, getQuestions);
router.get('/:id', auth, getQuestionById);
router.get('/category/:topic', auth, getQuestionsByCategory);
router.put('/:id', auth, updateQuestion);
router.delete('/:id', auth, deleteQuestion);

module.exports = router;
