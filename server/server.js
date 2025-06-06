// === Backend: server.js ===
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const moodSchema = new mongoose.Schema({
    userId: String,
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    mood: String,
    note: String,
    message: String,
});

const Mood = mongoose.model('Mood', moodSchema);

app.post('/api/moods', async (req, res) => {
    const mood = new Mood(req.body);
    const saved = await mood.save();
    res.json(saved);
});

app.get('/api/moods/:userId', async (req, res) => {
    const moods = await Mood.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(moods);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));