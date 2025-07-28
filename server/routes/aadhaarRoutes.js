const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const protect = require('../middleware/authMiddleware');
const AadhaarUser = require('../models/aadhaarUser');

// 📱 POST: Login with phone (generate/send OTP)
router.post('/login', async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = '123456'; // 🔐 Mock OTP for dev

  let user = await AadhaarUser.findOne({ phoneNumber });

  if (!user) {
    user = await AadhaarUser.create({ phoneNumber, otp });
  } else {
    user.otp = otp;
    await user.save();
  }

  res.status(200).json({ message: 'OTP sent', otp }); // In real app: don't return OTP!
});

// 🔑 POST: Verify OTP and generate JWT
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const user = await AadhaarUser.findOne({ phoneNumber });

  if (!user || user.otp !== otp) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'OTP verified', token, user });
});

// 🏠 POST: Submit address form (protected)
router.post('/address-form', protect, async (req, res) => {
  const { house, street, district, state, pincode } = req.body;

  try {
    const user = await AadhaarUser.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.address = { house, street, district, state, pincode };
    user.status = 'pending';
    await user.save();

    res.status(200).json({ message: 'Address saved' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving address' });
  }
});

// 🔍 GET: Preview address (protected)
router.get('/address/preview', protect, async (req, res) => {
  try {
    const user = await AadhaarUser.findById(req.user._id);
    if (!user || !user.address) {
      return res.status(404).json({ message: 'No address found' });
    }

    res.status(200).json({ address: user.address });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching address' });
  }
});

// 📦 GET: Aadhaar status (protected)
router.get('/address/status', protect, async (req, res) => {
  try {
    const user = await AadhaarUser.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ status: user.status });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching status' });
  }
});

module.exports = router;
