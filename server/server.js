import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import app from './app.js';

// Mongo DB Connection
const uri = process.env.MONGO_URI;
await mongoose.connect(uri);

// Serve static files (only in production)
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Catch-all for SPA routing
    app.get('/{*any}', (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
    });
}

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});