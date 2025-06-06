import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    questionId: String,
    questionText: String,
    type: String, // 'checkbox', 'radio', 'text'
    options: [String]
});

export default mongoose.model('Question', QuestionSchema);