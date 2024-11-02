const express = require('express');
const cors = require('cors')
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const restaurentRoutes = require('./routes/restaurentRoutes');
const connectDB = require('./config/db');
const app =express();

app.use(express.json());
app.use(cors());
connectDB();

app.use("/api",userRoutes,restaurentRoutes);

const PORT = process.env.PORT || 9000;

app.listen(PORT,()=>{
    console.log(`server is running in http://localhost:${PORT}`)
})