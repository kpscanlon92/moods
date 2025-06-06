import mongoose from 'mongoose';

const MoodSchema = new mongoose.Schema({
    userId: String,
    answers: mongoose.Schema.Types.Mixed, // object with questionId -> answer
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Mood', MoodSchema);