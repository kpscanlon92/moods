import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import moodRoutes from './routes/moodRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', moodRoutes);
app.use('/api', questionRoutes);

dotenv.config();
const uri = process.env.MONGO_URI;
await mongoose.connect(uri);

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});