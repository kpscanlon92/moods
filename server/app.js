import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import configurePassport from './config/passport.js'
import moodRoutes from './routes/moodRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

dotenv.config();

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