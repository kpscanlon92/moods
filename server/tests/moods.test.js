import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import Mood from '../models/Mood.js';
import {MongoMemoryServer} from "mongodb-memory-server";

let token;
let mongo;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);

    const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'testpass123',
    });

    token = res.body.token;
});

afterEach(async () => {
    await Mood.deleteMany();
});

afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
    await mongo.stop();
});

describe('Mood Routes', () => {
    it('should create a mood entry', async () => {
        const res = await request(app)
            .post('/api/moods')
            .set('Authorization', `Bearer ${token}`)
            .send({
                answers:{
                    "sensoryDiscomfort":["Noises","Temperature - Hot"],
                    "sensoryComfort":["Thirst"],
                    "emotions":["Disgust (Disapproval, Disappointed, Awful, Aversion)"],
                    "bodySensations":["No"],
                    "capacity":["Interest in things I like"]
                }
            });

        expect(res.statusCode).toBe(201);
    });

    it('should get moods for a user', async () => {
        // Create a mood
        await request(app)
            .post('/api/moods')
            .set('Authorization', `Bearer ${token}`)
            .send({
                answers:{
                    "sensoryDiscomfort":["Noises","Temperature - Hot"],
                    "sensoryComfort":["Thirst"],
                    "emotions":["Disgust (Disapproval, Disappointed, Awful, Aversion)"],
                    "bodySensations":["No"],
                    "capacity":["Interest in things I like"]
                }
            });

        const res = await request(app)
            .get('/api/history')
            .set('Authorization', `Bearer ${token}`);

        //console.log(res.body[0].answers);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].answers).toHaveProperty('sensoryDiscomfort', ["Noises","Temperature - Hot"]);
    });
});