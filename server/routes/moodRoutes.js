import express from 'express';
import passport from 'passport';
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


router.post('/moods', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { answers } = req.body;
        const userId = req.user.id;

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

router.get('/history', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const moods = await Mood.find({ userId: req.user.id}).sort({ date: -1 });
        res.send(moods);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch moods' });
    }
});

router.get('/stats', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user.id;

        const moods = await Mood.find({ userId });

        // Count number of distinct days (by date only)
        const dates = new Set(moods.map(m => new Date(m.date).toDateString()));
        const totalEntries = moods.length;

        const questionStats = {};

        moods.forEach(mood => {
            const answers = mood.answers || {};
            for (const [questionText, answer] of Object.entries(answers)) {
                if (!questionStats[questionText]) {
                    questionStats[questionText] = {
                        question: questionText,
                        answers: {},
                        total: 0,
                    };
                }

                const increment = (ans) => {
                    questionStats[questionText].answers[ans] = (questionStats[questionText].answers[ans] || 0) + 1;
                    questionStats[questionText].total += 1;
                };

                if (Array.isArray(answer)) {
                    answer.forEach(ans => increment(ans));
                } else {
                    increment(answer);
                }
            }
        });

        const formatted = Object.values(questionStats).map(q => ({
            question: q.question,
            total: q.total,
            topAnswers: Object.entries(q.answers)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([text, count]) => ({ text, count })),
        }));

        res.json({
            daysAnswered: dates.size,
            totalEntries,
            questionStats: formatted,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to get stats' });
    }
});

export default router;