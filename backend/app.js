import express from "express";
import adminroutes from './routes/adminrouter.js';
import userrouter from './routes/userrouter.js';
import connectDB from "./db/dbconnect.js";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';



const app = express();
// app.use(fileUpload({
//   createParentPath: true 
// }));

app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    credentials: true,
    
  }));
app.use(express.json())
app.use('/user', userrouter);
app.use('/admin', adminroutes);
connectDB()
app.listen(3000, () => {
    console.log("Server Is Ready");
});
