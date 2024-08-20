import express from "express";
import adminroutes from './routes/adminrouter.js';
import userrouter from './routes/userrouter.js';

const app = express();

app.use('/user', userrouter);
app.use('/admin', adminroutes);

app.listen(3000, () => {
    console.log("Server Is Ready");
});
