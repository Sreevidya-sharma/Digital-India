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

// Serve static folders explicitly
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/lang', express.static(path.join(__dirname, '../lang')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/html', express.static(path.join(__dirname, '../html')));

// Serve home.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'home.html'));
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/aadhaar', require('./routes/aadhaarRoutes'));
app.use('/api/digilocker', require('./routes/digilockerRoutes'));
app.use('/api/ehospital', require('./routes/ehospitalRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔌 Server started on port ${PORT}`));
