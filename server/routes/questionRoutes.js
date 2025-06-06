import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.send(questions);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch questions' });
    }
});

router.post('/questions', async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).send(question);
    } catch (err) {
        res.status(500).send({ error: 'Failed to save question' });
    }
});

export default router;