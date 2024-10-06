import express from "express";
import adminroutes from './routes/adminrouter.js';
import userrouter from './routes/userrouter.js';
import connectDB from "./db/dbconnect.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

// Initialize express app
const app = express();

// Load environment variables (if using dotenv)
import dotenv from 'dotenv';
dotenv.config(); // Ensure .env is loaded before using process.env variables

// Define FRONTEND_URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://order-processing-app-z5s8.vercel.app';

// Middleware setup
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// CORS setup for all routes
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204, // For legacy browsers to handle preflight requests correctly
}));

// Additional handling for preflight requests (optional)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end(); // End preflight request with 204 No Content
  }
  next();
});

// Define routes
app.use('/user', userrouter);
app.use('/admin', adminroutes);

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
