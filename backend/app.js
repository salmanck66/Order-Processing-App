import express from "express"

const app = express()

app('/',(req,res)=>
{
    res.status(200).json({data:"welcome to server"})
})
app.listen(3000,()=>
{
    console.log("success");
    
})