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

const basePath = path.join(__dirname, '..');

app.use('/css', express.static(path.join(basePath, 'css')));
app.use('/images', express.static(path.join(basePath, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(basePath, 'html')));

app.get('/', (req, res) => {
  res.sendFile(path.join(basePath, 'html', 'home.html'));
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/aadhaar', require('./routes/aadhaarRoutes'));
app.use('/api/digilocker', require('./routes/digilockerRoutes'));
app.use('/api/ehospital', require('./routes/ehospitalRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔌 Server started on port ${PORT}`));
