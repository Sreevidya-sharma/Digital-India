// Import necessary modules and models
const DigiLockerUser = require('../models/digilockerUser'); // Assuming digilockerUser.js defines this model
const protectDigi = require('../middleware/protectDigi'); // Assuming this middleware is used for DigiLocker protection

// @desc    Login or register DigiLocker user (sends OTP)
// @route   POST /api/digilocker/login
// @access  Public
const digilockerLogin = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber || phoneNumber.length !== 10) {
            return res.status(400).json({ message: 'Please provide a valid 10-digit phone number.' });
        }

        // In a real application: Generate and send a real OTP
        // For this mock demo: Use a fixed OTP
        const otp = '123456'; // Mock OTP

        let user = await DigiLockerUser.findOne({ phoneNumber });

        if (!user) {
            // Create new user if not found
            user = await DigiLockerUser.create({ phoneNumber, otp });
        } else {
            // Update OTP for existing user
            user.otp = otp;
            await user.save();
        }

        // Respond with success message and OTP (for demo purposes only)
        res.status(200).json({ message: 'OTP sent successfully!', otp });

    } catch (error) {
        console.error('Error in DigiLocker login/OTP send:', error.message);
        res.status(500).json({ message: 'Server error during DigiLocker login.' });
    }
};

// @desc    Verify OTP and generate JWT for DigiLocker
// @route   POST /api/digilocker/verify-otp
// @access  Public
const verifyDigilockerOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required.' });
        }

        const user = await DigiLockerUser.findOne({ phoneNumber });

        if (!user || user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP or phone number.' });
        }

        // Generate JWT token for DigiLocker session
        const token = require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'OTP verified successfully!', token });

    } catch (error) {
        console.error('Error in DigiLocker OTP verification:', error.message);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};

// @desc    Get list of user's documents
// @route   GET /api/digilocker/documents
// @access  Protected (using protectDigi middleware)
const getDocuments = async (req, res) => {
    try {
        // req.user is set by the protectDigi middleware
        const user = await DigiLockerUser.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'DigiLocker user not found.' });
        }

        // Return the documents array (or an empty array if none)
        res.status(200).json({ documents: user.documents || [] });

    } catch (error) {
        console.error('Error fetching DigiLocker documents:', error.message);
        res.status(500).json({ message: 'Server error fetching documents.' });
    }
};

// @desc    Upload a mock document
// @route   POST /api/digilocker/upload
// @access  Protected
const uploadDocument = async (req, res) => {
    try {
        // This is a mock upload. In a real app, you'd handle file storage (e.g., AWS S3, Google Cloud Storage).
        // For this demo, we'll just add a dummy document entry to the user's documents array.

        // Assuming file is sent via FormData and you might want to extract some details
        // For simplicity, we'll add a generic mock document.
        const user = await DigiLockerUser.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'DigiLocker user not found.' });
        }

        // Add a mock document. You might want to get details from req.body or req.file
        const newMockDoc = {
            name: `Uploaded Doc ${Date.now()}`,
            type: 'Other',
            issuedBy: 'User Upload',
            issueDate: new Date().toISOString().split('T')[0],
            fileUrl: '/uploads/mock_document.pdf' // A generic mock URL
        };

        user.documents.push(newMockDoc);
        await user.save();

        res.status(200).json({ message: 'Document uploaded successfully (mock)!', document: newMockDoc });

    } catch (error) {
        console.error('Error uploading mock document:', error.message);
        res.status(500).json({ message: 'Server error during mock document upload.' });
    }
};


module.exports = {
    digilockerLogin,
    verifyDigilockerOtp,
    getDocuments,
    uploadDocument
};
