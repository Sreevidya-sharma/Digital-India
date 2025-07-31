const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { Appointment, IPD, LabReport } = require('../models/eHospital');

// POST /api/ehospital/appointments
router.post('/appointments', protect, async (req, res) => {
    const { department, doctor, date, time } = req.body;
    try {
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
    const { reason, ward, admitDate } = req.body;
    try {
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
    const { labId } = req.query;
    try {
        const report = await LabReport.findOne({ labId, userId: req.user._id });
        if (!report) return res.status(404).json({ message: 'No report found' });
        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching report' });
    }
});

// Dev-only: insert dummy lab report
router.post('/labreport/mock', protect, async (req, res) => {
    try {
        const report = await LabReport.create({
            userId: req.user._id,
            labId: "ABC123",
            testName: "Blood Test",
            result: "Hemoglobin normal",
            date: "2025-07-01"
        });
        res.status(201).json({ message: "Mock lab report created", report });
    } catch (err) {
        res.status(500).json({ message: "Error creating mock report" });
    }
});

module.exports = router;
