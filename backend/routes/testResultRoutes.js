const express = require('express');
const router = express.Router();
const { saveTestResult, getUserTestResults, provideFeedback } = require('../controllers/testresultcontroller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, saveTestResult);
router.get('/', auth, getUserTestResults);
router.get('/feedback/:id', auth, provideFeedback);

module.exports = router;
