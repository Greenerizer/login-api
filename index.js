const express = require('express');
const mongoose = require('mongoose');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

// Import routes
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');

// Connect to DB
mongoose.set('strictQuery', false);
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true },
    () => console.log('Connected to DB')
);

// Middleware
app.use(express.json());

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/profile', profileRoute);


app.listen(3000, () => console.log("Connected to server and API is running"));