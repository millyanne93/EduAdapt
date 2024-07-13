const express = require('express');
const router = express.Router();
const { getQuestionPaper } = require('../controllers/questionPaperController');
const auth = require('../middleware/authMiddleware');

router.get('/:id', auth, getQuestionPaper);

module.exports = router;
