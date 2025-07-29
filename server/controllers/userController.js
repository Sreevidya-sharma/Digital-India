// Import necessary modules and models
const User = require('../models/User'); // Assuming User.js defines this model
const protect = require('../middleware/authMiddleware'); // Assuming this middleware is used for protection

// @desc    Get logged-in user's profile
// @route   GET /api/user/profile
// @access  Protected
const getUserProfile = async (req, res) => {
    try {
        // req.user is set by the protect middleware after token verification
        const user = await User.findById(req.user._id).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Server error fetching user profile.' });
    }
};

// @desc    Mark a module as completed for the authenticated user
// @route   POST /api/user/complete
// @access  Protected
const markModuleComplete = async (req, res) => {
    try {
        const { moduleName } = req.body;

        if (!moduleName) {
            return res.status(400).json({ message: 'Module name is required to mark as complete.' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add module to completedModules array if not already present
        if (!user.completedModules.includes(moduleName)) {
            user.completedModules.push(moduleName);
            await user.save();
        }

        res.status(200).json({ message: `${moduleName} module marked as complete.` });

    } catch (error) {
        console.error('Error marking module complete:', error.message);
        res.status(500).json({ message: 'Server error marking module complete.' });
    }
};

// @desc    Generate mock certificate data for a completed module
// @route   GET /api/user/certificate/:module
// @access  Protected
const getCertificateData = async (req, res) => {
    try {
        const { module } = req.params; // Module name from URL parameter

        if (!module) {
            return res.status(400).json({ message: 'Module name is required for certificate.' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the module is actually completed by the user
        if (!user.completedModules.includes(module)) {
            return res.status(403).json({ message: `User has not completed the ${module} module.` });
        }

        // Generate mock certificate data
        const moduleDisplayNames = {
            aadhaar: 'Aadhaar eKYC Module',
            digilocker: 'DigiLocker Basics',
            ehospital: 'eHospital Module'
        };

        const certificateData = {
            name: user.fullName || 'Valued Participant',
            module: moduleDisplayNames[module] || module,
            date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
            message: `for successfully completing the ${moduleDisplayNames[module] || module} course.`
        };

        res.status(200).json(certificateData);

    } catch (error) {
        console.error('Error fetching certificate data:', error.message);
        res.status(500).json({ message: 'Server error fetching certificate data.' });
    }
};


module.exports = {
    getUserProfile,
    markModuleComplete,
    getCertificateData
};
