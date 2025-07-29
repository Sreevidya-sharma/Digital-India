const express = require('express');
const router = express.Router();
const User = require('../models/User');
const protect = require('../middleware/authMiddleware'); // use shared auth middleware

// ✅ GET: User profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST: Mark module as completed
router.post('/complete', protect, async (req, res) => {
  const { moduleName } = req.body;
  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.completedModules.includes(moduleName)) {
      user.completedModules.push(moduleName);
      await user.save();
    }

    res.json({ message: 'Module marked as complete' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating module completion' });
  }
});

// ✅ GET: Certificate preview
module.exports = router;
