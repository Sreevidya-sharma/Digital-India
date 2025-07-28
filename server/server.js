const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5500',
  'https://digital-india-vnzk.onrender.com'
];

// Log incoming request origins
app.use((req, res, next) => {
  console.log(`Incoming request from origin: ${req.headers.origin}`);
  next();
});

// CORS config
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.options('*', cors());
app.use(express.json());

const basePath = path.join(__dirname, '..');

// Serve static assets
app.use('/css', express.static(path.join(basePath, 'css')));
app.use('/js', express.static(path.join(basePath, 'js')));
app.use('/images', express.static(path.join(basePath, 'images')));
app.use('/lang', express.static(path.join(basePath, 'lang')));
app.use('/uploads', express.static(path.join(basePath, 'uploads')));
app.use(express.static(path.join(basePath, 'html')));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(basePath, 'html/home.html'));
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/aadhaar', require('./routes/aadhaarRoutes'));
app.use('/api/digilocker', require('./routes/digilockerRoutes'));
app.use('/api/ehospital', require('./routes/ehospitalRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS error: This origin is not allowed.' });
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🔌 Server started on port ${PORT}`));
