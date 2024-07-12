const express = require('express');
const router = express.Router();
const { createQuestion,
        getQuestionsByCategory,
        getQuestions } = require('../controllers/questioncontroller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createQuestion);
router.get('/:topic', auth, getQuestionsByCategory);
router.get('/', auth, getQuestions);

module.exports = router;
