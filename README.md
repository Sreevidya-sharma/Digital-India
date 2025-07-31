Digital India Access Training
📄 Project Overview
The Digital India Access Training project is a comprehensive, full-stack web application designed to simulate and educate users on key digital government services in India. The platform provides interactive courses and quizzes for modules like Aadhaar eKYC, DigiLocker, and eHospital, empowering users with the knowledge to navigate these digital services.
This application is built with a Node.js backend and a pure HTML/CSS/JavaScript frontend, deployed on Render, and uses MongoDB for data persistence.
🚀 Features
Core Platform
* User Authentication: Secure registration and login for users via a full-fledged authentication system.
* Multilingual Support: The application is enabled with a translation system to provide content in multiple Indian languages, enhancing accessibility.
* Dashboard & Progress Tracking: A personalized dashboard shows user progress through the various training modules.
* Quizzes & Certificates: Users can take quizzes for each module, and upon passing, receive a digital Certificate of Achievement.
Simulated Service Demos
* Aadhaar eKYC Demo:
    * Simulate Aadhaar number and OTP-based login.
    * Practice updating a mock Aadhaar address.
    * View and download a mock e-Aadhaar.
* DigiLocker Demo:
    * Register and log in using a mobile number and mock OTP/PIN.
    * View and manage a list of mock digital documents.
    * Simulate uploading a new document.
* eHospital Demo:
    * Book a mock outpatient department (OPD) appointment.
    * Submit details for an inpatient department (IPD) admission.
    * Retrieve and view a mock lab report using a unique ID.
🛠️ Tech Stack
* Frontend: HTML, CSS, JavaScript (Vanilla JS for DOM manipulation and API calls)
* Backend: Node.js, Express.js
* Database: MongoDB via Mongoose ODM
* Deployment: Render
* Other Libraries: bcryptjs, cors, dotenv, jsonwebtoken for the backend, html2pdf.js for the frontend.
📂 Project Structure
.
├── css/                  # Frontend CSS files
├── html/                 # Frontend HTML pages
│   ├── mock_aadhaar/
│   ├── mock_digilocker/
│   ├── mock_ehospital/
│   └── ...
├── images/               # Image assets
├── js/                   # Frontend JavaScript files
├── lang/                 # Multilingual JSON files (en.json, bn.json, etc.)
├── server/               # Node.js backend code
│   ├── config/
│   │   └── db.js         # MongoDB connection setup
│   ├── controllers/
│   │   └── ...Controller.js # Logic for each API endpoint
│   ├── middleware/
│   │   └── authMiddleware.js # Authentication middleware
│   ├── models/
│   │   └── ...Model.js   # Mongoose schemas for the database
│   ├── routes/
│   │   └── ...Routes.js  # Express route definitions
│   └── server.js         # Main server entry point
├── .env                  # Environment variables (not in repo)
├── package.json          # Node.js dependencies
└── README.md             # This file

⚙️ Setup Instructions
Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas account or a local MongoDB instance
Step-by-step Guide
1. Clone the repository: git clone https://github.com/Sreevidya-sharma/Digital-India.git
2. cd Digital-India
3. 
4. 
5. Install backend dependencies: cd server
6. npm install
7. 
8. 
9. Create a .env file: In the server directory, create a .env file and add your MongoDB connection string and a JWT secret. MONGO_URI=your_mongodb_connection_string
10. JWT_SECRET=your_super_secret_key
11. 
12. 
13. Run the application locally: npm start
14. # or for development with hot-reloading
15. npm run dev
16. 
17. 
The application will be available at http://localhost:3001 (or the port you specify).
🌐 API Endpoints
The API is exposed at the /api route.
Route	Method	Description
/api/auth/register	POST	Registers a new user account.
/api/auth/login	POST	Logs in a user and returns a JWT.
/api/user/profile	GET	Retrieves the authenticated user's profile.
/api/ehospital/appointment	POST	Books a new eHospital appointment.
/api/ehospital/labreport	GET	Fetches a lab report by ID for a user.
/api/quiz/submit	POST	Submits quiz answers and updates user status.
