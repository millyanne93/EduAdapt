const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuthMiddleware');
const {
    createQuestion,
    getQuestionsByCategory,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    generateAndStoreQuestions
} = require('../controllers/questioncontroller');

router.post('/', auth, adminAuth, createQuestion);
router.get('/', auth, adminAuth, getQuestions);
router.get('/:id', auth, adminAuth, getQuestionById);
router.get('/category/:topic', auth, adminAuth, getQuestionsByCategory);
router.put('/:id', auth, adminAuth, updateQuestion);
router.delete('/:id', auth, adminAuth, deleteQuestion);

router.post('/generate', auth, generateAndStoreQuestions);

module.exports = router;
