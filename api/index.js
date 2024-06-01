import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('connected to mongoDB');
})
.catch((err)=>{
    console.log(err);
})

const app = express();

app.listen(3000, ()=>{
    console.log('server ruuning on port 3000');
})