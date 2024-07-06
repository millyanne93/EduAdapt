const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions } = require('../controllers/questioncontroller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createQuestion);
router.get('/', auth, getQuestions);

module.exports = router;
