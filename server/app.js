import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import configurePassport from './config/passport.js'
import moodRoutes from './routes/moodRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

// CORS for API calls
const getCorsOrigin = () => {
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') {
        return 'https://moods-frontend.onrender.com';
    }
    return 'http://localhost:5173';
};
const corsOptions = {
    origin: getCorsOrigin()
};
app.use(cors(corsOptions));

// middlewares, routes, etc.
app.use(express.json());

// Passport config for auth
app.use(passport.initialize());
configurePassport(passport, process.env.JWT_SECRET);

// Mount routes
app.use('/api', moodRoutes);
app.use('/api', questionRoutes);
app.use('/api/auth', authRoutes);

export default app;