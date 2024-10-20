import express from "express";
import dotenv from 'dotenv';
import adminroutes from './routes/adminrouter.js';
import userrouter from './routes/userrouter.js';
import connectDB from "./db/dbconnect.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(fileUpload());
console.log("Frontend URL:", process.env.FRONTEND_URL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Use the value from the .env file
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end();
  }
  next();
});

app.use(express.json());
app.use('/user', userrouter);
app.use('/admin', adminroutes);
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is ready on port ${PORT}`);
});
