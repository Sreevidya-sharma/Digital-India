const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve all static frontend files (css, js, images, html, etc.)
app.use(express.static(path.join(__dirname, '..')));

// Serve home.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'home.html'));
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
const authRoutes = require('./routes/authRoutes');
const aadhaarRoutes = require('./routes/aadhaarRoutes');
const digilockerRoutes = require('./routes/digilockerRoutes');
const ehospitalRoutes = require('./routes/ehospitalRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/aadhaar', aadhaarRoutes);
app.use('/api/digilocker', digilockerRoutes);
app.use('/api/ehospital', ehospitalRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔌 Server started on port ${PORT}`));
