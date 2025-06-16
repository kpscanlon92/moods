import express from 'express';
import mongoose from 'mongoose';

import app from './app.js';

// Mongo DB Connection
const uri = process.env.MONGO_URI;
await mongoose.connect(uri);

// Serve static files (only in production)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static("build"));

    // Catch-all for SPA routing
    app.get("/{*any}", (req, res) => {
        res.redirect('/');
    });
}

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});