const express = require('express');
const router = express.Router();
const { saveTestResult, getUserTestResults } = require('../controllers/testresultcontroller');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, saveTestResult);
router.get('/', auth, getUserTestResults);

module.exports = router;
