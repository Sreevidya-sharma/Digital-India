// Import necessary modules and models
const User = require('../models/User'); // Assuming User.js defines this model
const protect = require('../middleware/authMiddleware'); // Assuming this middleware is used for protection

// Mock correct answers (should ideally be stored in a database or config)
const correctAnswersMap = {
    aadhaar: [0, 1, 2, 1, 1, 1, 0, 0, 1, 1], // Example: 0=a, 1=b, 2=c, 3=d
    digilocker: [1, 3, 0, 2, 1, 2, 0, 2, 1, 2], // Example: 0=a, 1=b, 2=c, 3=d
    ehospital: [1, 0, 0, 0, 2, 2, 0, 2, 0, 0] // Example: 0=a, 1=b, 2=c, 3=d
};

// @desc    Submit quiz answers and update user's quiz status
// @route   POST /api/quiz/submit
// @access  Protected
const submitQuiz = async (req, res) => {
    try {
        const { module, answers } = req.body; // 'answers' is an array of selected option indices (0-3)

        // Basic validation
        if (!module || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Module and answers array are required.' });
        }

        const correctAnswers = correctAnswersMap[module];

        if (!correctAnswers) {
            return res.status(400).json({ message: 'Invalid quiz module.' });
        }

        let score = 0;
        // Compare submitted answers with correct answers
        correctAnswers.forEach((correct, index) => {
            if (answers[index] === correct) {
                score++;
            }
        });

        // Determine if user passed (e.g., 70% or more correct)
        const passingScoreThreshold = Math.ceil(correctAnswers.length * 0.7);
        const passed = score >= passingScoreThreshold;

        // Find the authenticated user
        const user = await User.findById(req.user._id); // req.user is set by protect middleware

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user's quiz status for this module
        if (!user.quizStatus) {
            user.quizStatus = new Map(); // Initialize if not present
        }
        user.quizStatus.set(module, passed ? 'passed' : 'failed');
        await user.save();

        res.status(200).json({
            message: `Quiz submitted. You ${passed ? 'passed' : 'failed'}!`,
            score,
            totalQuestions: correctAnswers.length,
            passed
        });

    } catch (error) {
        console.error('Error submitting quiz:', error.message);
        res.status(500).json({ message: 'Server error during quiz submission.' });
    }
};

// @desc    Get user's quiz status for a specific module
// @route   GET /api/quiz/status
// @access  Protected
const getQuizStatus = async (req, res) => {
    try {
        const { module } = req.query;

        if (!module) {
            return res.status(400).json({ message: 'Module name is required.' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const status = user.quizStatus ? user.quizStatus.get(module) || 'not attempted' : 'not attempted';

        res.status(200).json({ module, status });

    } catch (error) {
        console.error('Error fetching quiz status:', error.message);
        res.status(500).json({ message: 'Server error fetching quiz status.' });
    }
};


module.exports = {
    submitQuiz,
    getQuizStatus
};
