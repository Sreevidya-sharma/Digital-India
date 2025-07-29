// Import necessary modules and models
const AadhaarUser = require('../models/aadhaarUser'); // Assuming aadhaarUser.js defines this model
const protect = require('../middleware/authMiddleware'); // Assuming this middleware is used for protection

// @desc    Send OTP for Aadhaar login/verification
// @route   POST /api/aadhaar/send-otp
// @access  Public (or protected if user needs to be logged in to request OTP)
const sendOtp = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;

        // Basic validation
        if (!aadhaarNumber || aadhaarNumber.length !== 12) {
            return res.status(400).json({ message: 'Please provide a valid 12-digit Aadhaar number.' });
        }

        // In a real application: Generate a random OTP and send it via SMS/email
        // For this mock demo: Use a fixed OTP for testing
        const otp = '123456'; // Mock OTP

        // Find or create AadhaarUser (if you want to store mock OTPs or link to existing users)
        let user = await AadhaarUser.findOne({ phoneNumber: aadhaarNumber }); // Using phoneNumber as Aadhaar number for simplicity

        if (!user) {
            user = await AadhaarUser.create({ phoneNumber: aadhaarNumber, otp });
        } else {
            user.otp = otp;
            await user.save();
        }

        // Respond with the OTP (for demo purposes only, never do this in production)
        res.status(200).json({ message: 'OTP sent successfully!', otp });

    } catch (error) {
        console.error('Error sending Aadhaar OTP:', error.message);
        res.status(500).json({ message: 'Server error during OTP send.' });
    }
};

// @desc    Submit Aadhaar address form
// @route   POST /api/aadhaar/address-form
// @access  Protected
const submitAddressForm = async (req, res) => {
    try {
        // Extract address data from request body
        // Frontend sends house, street, district, state, pincode (and potentially landmark, area, city, language, PoA)
        // Backend model (AadhaarUser) expects address: { name, house, locality, pin, district, state }
        // You might need to adjust the frontend or backend models/logic to align
        const { house, street, district, state, pincode } = req.body; // Adjust based on your frontend's 'data' object

        // Basic validation
        if (!house || !street || !district || !state || !pincode) {
            return res.status(400).json({ message: 'All address fields are required.' });
        }

        // Find the authenticated Aadhaar user
        const user = await AadhaarUser.findById(req.user._id); // req.user is set by protect middleware

        if (!user) {
            return res.status(404).json({ message: 'Aadhaar user not found.' });
        }

        // Update the user's address and set status to pending
        user.address = {
            house,
            locality: street, // Mapping street to locality for your model
            district,
            state,
            pin: pincode
        };
        user.status = 'pending'; // Set status to pending after submission
        await user.save();

        res.status(200).json({ message: 'Address submitted successfully for verification!' });

    } catch (error) {
        console.error('Error submitting Aadhaar address form:', error.message);
        res.status(500).json({ message: 'Server error during address submission.' });
    }
};

// @desc    Preview Aadhaar address
// @route   GET /api/aadhaar/address/preview
// @access  Protected
const previewAddress = async (req, res) => {
    try {
        // Find the authenticated Aadhaar user
        const user = await AadhaarUser.findById(req.user._id); // req.user is set by protect middleware

        if (!user) {
            return res.status(404).json({ message: 'Aadhaar user not found.' });
        }

        // Respond with the user's stored address and status
        res.status(200).json({
            address: user.address,
            status: user.status
        });

    } catch (error) {
        console.error('Error fetching Aadhaar address preview:', error.message);
        res.status(500).json({ message: 'Server error during address preview fetch.' });
    }
};

// @desc    Get Aadhaar address status
// @route   GET /api/aadhaar/address/status
// @access  Protected
const getAddressStatus = async (req, res) => {
    try {
        // Find the authenticated Aadhaar user
        const user = await AadhaarUser.findById(req.user._id); // req.user is set by protect middleware

        if (!user) {
            return res.status(404).json({ message: 'Aadhaar user not found.' });
        }

        // Respond with the user's address status
        res.status(200).json({ status: user.status });

    } catch (error) {
        console.error('Error fetching Aadhaar address status:', error.message);
        res.status(500).json({ message: 'Server error during address status fetch.' });
    }
};

module.exports = {
    sendOtp,
    submitAddressForm,
    previewAddress,
    getAddressStatus
};
