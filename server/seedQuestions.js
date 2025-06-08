import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const uri = process.env.MONGO_URI;

await mongoose.connect(uri);

const questions = [
    {
        questionId: 'emotions',
        questionText: 'What emotions am I experiencing right now?',
        type: 'checkbox',
        options: [
            'Happy (Joy, Curious, Proud, Satisfied, Courageous, Intimate, Optimistic)',
            'Surprise (Shock, Confusion, Awe, Excitement)',
            'Fear (Embarrassed, Unwanted, Inferior, Insecure, Anxious, Scared)',
            'Anger (Hurt, Insecure, Hateful, Mad, Aggressive, Irritated, Distant, Critical)',
            'Disgust (Disapproval, Disappointed, Awful, Aversion)',
            'Sad (Guilt, Abandoned, Despair, Depressed, Lonely, Apathetic)',
            'Unclear',
            'Other'
        ]
    },
    {
        questionId: 'bodySensations',
        questionText: 'Are the emotions showing up in my body?',
        type: 'checkbox',
        options: ['Yes', 'Unclear', 'No', 'Other']
    },
    {
        questionId: 'capacity',
        questionText: "What's my capacity feeling like?",
        type: 'checkbox',
        options: [
            'Functional',
            'Able to make decisions',
            'Unable to make decisions',
            'Interest in things I like',
            'No interest in things',
            'Non-functional',
            'Stuck',
            'Depressed or existential',
            'Shutdown',
            'Panic attack',
            'Other'
        ]
    },
    {
        questionId: 'sensoryDiscomfort',
        questionText: 'Sensory input I am not enjoying?',
        type: 'checkbox',
        options: [
            'Noises',
            'Lights',
            'Textures',
            'Temperature - Hot',
            'Temperature - Cold',
            'Body - itchy, hurt, gastro, headache, etc',
            'Other'
        ]
    },
    {
        questionId: 'sensoryComfort',
        questionText: 'Sensory input I am seeking?',
        type: 'checkbox',
        options: [
            'Hunger',
            'Thirst',
            'Does my body want to move?',
            'Stim - candy',
            'Stim - rocking',
            'Stim - fidgety',
            'Other'
        ]
    }
];

try {
    await Question.insertMany(questions);
    console.log('✅ Questions seeded!');
    process.exit();
} catch (err) {
    console.error('❌ Error seeding questions:', err);
    process.exit(1);
}