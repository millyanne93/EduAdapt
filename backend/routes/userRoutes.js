const express = require('express');
const router = express.Router();
const { registerUser, getUser, loginUser, getAllUsers } = require('../controllers/usercontroller');
const auth = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/me', auth, getUser);
router.post('/login', loginUser);
router.get('/', auth, getAllUsers);

module.exports = router;
