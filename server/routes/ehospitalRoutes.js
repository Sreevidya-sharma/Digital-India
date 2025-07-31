const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { Appointment, IPD, LabReport } = require('../models/eHospital');

// POST /api/ehospital/appointment
router.post('/appointment', protect, async (req, res) => {
    try {
        const { department, doctor, date, time } = req.body;
        const appointment = await Appointment.create({
            userId: req.user._id,
            department,
            doctor,
            date,
            time
        });
        res.status(201).json({ message: 'Appointment booked', appointment });
    } catch (err) {
        res.status(500).json({ message: 'Error booking appointment' });
    }
});

// POST /api/ehospital/ipd
router.post('/ipd', protect, async (req, res) => {
    try {
        const { reason, ward, admitDate } = req.body;
        const ipd = await IPD.create({
            userId: req.user._id,
            reason,
            ward,
            admitDate
        });
        res.status(201).json({ message: 'Admitted successfully', ipd });
    } catch (err) {
        res.status(500).json({ message: 'Error admitting patient' });
    }
});

// GET /api/ehospital/labreport
router.get('/labreport', protect, async (req, res) => {
    try {
        const { labId } = req.query;

        if (!labId) {
            return res.status(400).json({ message: 'Lab ID is required to fetch a report.' });
        }
        
        // This is a simple mock implementation for demonstration purposes.
        // It always returns the same report if a labId is provided.
        const mockReport = {
            labId: labId, // Return the ID that was submitted
            patientName: "Thotapalli Sreevidya", // Use a hardcoded name for consistency
            wbc: "5.5 x 10^9/L",
            rbc: "4.8 x 10^12/L",
            hemoglobin: "14 g/dL",
            platelet: "250 x 10^9/L",
            status: "Within Normal Range"
        };
        
        return res.status(200).json(mockReport);
        
    } catch (err) {
        console.error('Error fetching lab report:', err);
        res.status(500).json({ message: 'Error fetching report' });
    }
});

module.exports = router;
