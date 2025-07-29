// Import necessary modules and models
const Appointment = require('../models/eHospital').Appointment; // Assuming eHospital.js exports an object with Appointment, IPD, LabReport
const IPD = require('../models/eHospital').IPD;
const LabReport = require('../models/eHospital').LabReport;
const protect = require('../middleware/authMiddleware'); // Assuming this middleware is used for protection

// @desc    Book a new appointment
// @route   POST /api/ehospital/appointments
// @access  Protected (requires authentication token)
const bookAppointment = async (req, res) => {
    try {
        // Extract data from request body
        // Note: Frontend sends name, age, gender, mobile, hospital, department, date
        // Backend model (Appointment) expects userId, department, doctor, date, time
        // You might need to adjust the frontend or backend models/logic to align
        const { department, doctor, date, time } = req.body; // Adjust based on your frontend's 'appointment' object

        // Basic validation (you can add more robust validation here)
        if (!department || !date) {
            return res.status(400).json({ message: 'Please provide department and date for appointment.' });
        }

        // Create a new appointment in the database
        const appointment = await Appointment.create({
            userId: req.user._id, // req.user is set by the protect middleware
            department,
            doctor: doctor || 'Any Doctor', // Placeholder if doctor is optional from frontend
            date,
            time: time || 'Flexible' // Placeholder if time is optional from frontend
        });

        // Respond with success message and new appointment details
        res.status(201).json({
            message: 'Appointment booked successfully!',
            appointmentId: appointment._id, // Return a unique ID for reference
            patientId: req.user._id.toString() // Convert ObjectId to string for display
        });

    } catch (error) {
        console.error('Error booking appointment:', error.message);
        res.status(500).json({ message: 'Server error during appointment booking.' });
    }
};

// @desc    Submit IPD (In-Patient Department) admission details
// @route   POST /api/ehospital/ipd
// @access  Protected
const submitIPD = async (req, res) => {
    try {
        // Extract data from request body
        // Frontend sends patientName, patientId, admissionDate, ward, dischargeDate, transferTo
        // Backend model (IPD) expects userId, reason, ward, admitDate
        // You might need to adjust the frontend or backend models/logic to align
        const { reason, ward, admitDate } = req.body; // Adjust based on your frontend's 'payload' object

        // Basic validation
        if (!reason || !ward || !admitDate) {
            return res.status(400).json({ message: 'Please provide reason, ward, and admission date for IPD.' });
        }

        // Create a new IPD record
        const ipd = await IPD.create({
            userId: req.user._id, // req.user is set by the protect middleware
            reason,
            ward,
            admitDate
        });

        // Respond with success
        res.status(201).json({
            message: 'IPD admission submitted successfully!',
            ipdId: ipd._id
        });

    } catch (error) {
        console.error('Error submitting IPD:', error.message);
        res.status(500).json({ message: 'Server error during IPD submission.' });
    }
};

// @desc    Get lab report by labId
// @route   GET /api/ehospital/labreport
// @access  Protected
const getLabReport = async (req, res) => {
    try {
        const { labId } = req.query; // Lab ID is expected as a query parameter

        // Basic validation
        if (!labId) {
            return res.status(400).json({ message: 'Lab ID is required to fetch report.' });
        }

        // Find the lab report for the authenticated user and the given labId
        const labReport = await LabReport.findOne({ labId, userId: req.user._id });

        if (!labReport) {
            return res.status(404).json({ message: 'Lab report not found for this ID or user.' });
        }

        // Respond with the lab report data
        res.status(200).json(labReport);

    } catch (error) {
        console.error('Error fetching lab report:', error.message);
        res.status(500).json({ message: 'Server error during lab report fetch.' });
    }
};

module.exports = {
    bookAppointment,
    submitIPD,
    getLabReport
};
