import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import moodRoutes from './routes/moodRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import passport from 'passport';
import configurePassport from './config/passport.js'

dotenv.config();
const app = express();

app.use(cors({origin: "https://moods-frontend.onrender.com"}));
app.use(express.json());
app.use(passport.initialize());
configurePassport(passport, process.env.JWT_SECRET);

// Mongo DB Connection
const uri = process.env.MONGO_URI;
await mongoose.connect(uri);

// Mount routes
app.use('/api', moodRoutes);
app.use('/api', questionRoutes);
app.use('/api/auth', authRoutes);


const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});