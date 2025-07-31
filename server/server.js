const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Configure CORS for your Render deployment URL
app.use(cors({
    origin: 'https://digital-india-vnzk.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
// Handle preflight requests for all routes
app.options('*', cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the base path for static assets (assuming 'src' is the root of your project)
const basePath = path.join(__dirname, '..');

// Serve static files from respective directories. These should come BEFORE your API routes.
app.use('/css', express.static(path.join(basePath, 'css')));
app.use('/images', express.static(path.join(basePath, 'images')));
app.use('/js', express.static(path.join(basePath, 'js')));
app.use('/lang', express.static(path.join(basePath, 'lang')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(basePath, 'html')));

// Define the root route to serve home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(basePath, 'html', 'home.html'));
});

// --- Mount ALL API routes here, AFTER serving static files ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/aadhaar', require('./routes/aadhaarRoutes'));
app.use('/api/digilocker', require('./routes/digilockerRoutes'));
app.use('/api/ehospital', require('./routes/ehospitalRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/user', require('./routes/userRoutes'));


// --- IMPORTANT: This catch-all route must be the LAST route defined ---
// It handles any requests that do not match the routes above.
app.use('/*splat', (req, res) => {
    // Log the original URL to help debug what path was not found
    console.log(`404 Not Found: ${req.originalUrl}`);
    // Send a 404 response
    res.status(404).send('<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>');
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => console.log(`🔌 Server started on port ${PORT}`));
