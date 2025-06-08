import express from 'express';
import Mood from '../models/Mood.js';

const router = express.Router();


function mergeOtherAnswers(answers) {
    if (!answers) return answers;

    const cleaned = { ...answers };

    Object.keys(answers).forEach((key) => {
        if (key.endsWith('_other')) {
            const baseKey = key.slice(0, -6); // remove '_other'

            const otherText = answers[key]?.trim();
            const baseAnswer = answers[baseKey];

            if (otherText) {
                if (Array.isArray(baseAnswer)) {
                    // Replace 'Other' in array with 'Other (text)'
                    cleaned[baseKey] = baseAnswer.map((ans) =>
                        ans === 'Other' ? `Other (${otherText})` : ans
                    );
                } else if (baseAnswer === 'Other') {
                    cleaned[baseKey] = `Other (${otherText})`;
                }
            }
            // Remove the _other key from cleaned answers
            delete cleaned[key];
        }
    });

    return cleaned;
}


router.post('/moods', async (req, res) => {
    try {
        let { userId, answers } = req.body;

        answers = mergeOtherAnswers(answers);

        const moodEntry = new Mood({
            userId,
            answers,
            date: new Date()
        });

        await moodEntry.save();

        res.status(201).json({ message: 'Mood saved' });
    } catch (error) {
        console.error('Error saving mood:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/moods/:userId', async (req, res) => {
    try {
        const moods = await Mood.find({ userId: req.params.userId }).sort({ date: -1 });
        res.send(moods);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch moods' });
    }
});

export default router;