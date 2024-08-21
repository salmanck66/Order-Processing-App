import express from "express";
import adminroutes from './routes/adminrouter.js';
import userrouter from './routes/userrouter.js';
import connectDB from "./db/dbconnect.js";
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app = express();
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
app.use(express.json())
app.use('/user', userrouter);
app.use('/admin', adminroutes);
connectDB()
app.listen(3000, () => {
    console.log("Server Is Ready");
});
