import express from "express";
import adminroutes from './routes/adminrouter.js';
import userrouter from './routes/userrouter.js';
import connectDB from "./db/dbconnect.js";
const app = express();

app.use('/user', userrouter);
app.use('/admin', adminroutes);
connectDB()
app.listen(3000, () => {
    console.log("Server Is Ready");
});
