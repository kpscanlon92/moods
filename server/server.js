import mongoose from 'mongoose';

import app from './app.js';

// Mongo DB Connection
const uri = process.env.MONGO_URI;
await mongoose.connect(uri);


const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});