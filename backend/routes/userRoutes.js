const express = require('express');
const router = express.Router();
const { registerUser, getUser, loginUser, getAllUsers, getUsersResults, deleteUser } = require('../controllers/usercontroller');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuthMiddleware');

router.post('/register', registerUser);
router.get('/me', auth, getUser);
router.post('/login', loginUser);
router.get('/', auth, adminAuth, getAllUsers);
router.get('/:userId/results', auth, adminAuth, getUsersResults);
router.delete('/:userId', auth, adminAuth, deleteUser);

module.exports = router;
