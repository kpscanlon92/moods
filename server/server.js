import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import app from './app.js';


// Setup __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../client/public')));

// Catch-all route for SPA frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// CORS for API calls
const getCorsOrigin = () => {
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') {
        return ['https://moods-frontend.onrender.com'];
    }
    return ['http://localhost:3000'];
};
const corsOptions = {
    origin: getCorsOrigin(),
    credentials: true,
};
app.use(cors(corsOptions));


// Mongo DB Connection
const uri = process.env.MONGO_URI;
await mongoose.connect(uri);

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});