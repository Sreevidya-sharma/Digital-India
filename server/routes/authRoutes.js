// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// @route   POST /api/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/login
// @desc    Login user and return JWT token
router.post('/login', loginUser);

// @route   GET /api/profile
// @desc    Get logged-in user's profile
// @access  Protected
router.get('/profile', protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
