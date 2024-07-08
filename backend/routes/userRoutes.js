const express = require('express');
const router = express.Router();
const { registerUser, getUser, loginUser } = require('../controllers/usercontroller');
const auth = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/me', auth, getUser);
router.post('/login', loginUser);

module.exports = router;
