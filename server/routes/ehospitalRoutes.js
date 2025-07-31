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
        const userId = req.user._id; // Use the userId from the authenticated user

        // This is a mock implementation that checks for a specific ID
        // and returns a mock report, otherwise it returns 404.
        const mockLabId = "68b8b89892b6029b01a5c0c1";

        if (labId === mockLabId) {
            const mockReport = {
                labId: mockLabId,
                patientName: req.user.fullName, // Access the name directly from req.user
                wbc: "5.5 x 10^9/L",
                rbc: "4.8 x 10^12/L",
                hemoglobin: "14 g/dL",
                platelet: "250 x 10^9/L",
                status: "Within Normal Range"
            };
            return res.status(200).json(mockReport);
        } else {
            return res.status(404).json({ message: 'No report found for this ID.' });
        }
    } catch (err) {
        console.error('Error fetching lab report:', err);
        res.status(500).json({ message: 'Error fetching report' });
    }
});
module.exports = router;
