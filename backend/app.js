import express from "express";
import adminroutes from './routes/adminrouter.js';
import userrouter from './routes/userrouter.js';
import connectDB from "./db/dbconnect.js";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';



const app = express();


app.use(fileUpload());
console.log(process.env.FRONTEND_URL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
  origin: 'https://order-processing-app-tffa.vercel.app',
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

  
app.use(express.json())
app.use('/user', userrouter);
app.use('/admin', adminroutes);
connectDB()
app.listen(3000, () => {
    console.log("Server Is Ready");

});
