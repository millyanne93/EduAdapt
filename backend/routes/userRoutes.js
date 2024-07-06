const express = require('express');
const router = express.Router();
const { registerUser, getUser } = require('../controllers/usercontroller');
const auth = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/me', auth, getUser);

module.exports = router;
