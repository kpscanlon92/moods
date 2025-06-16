import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/User.js';

let mongo;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
});

afterEach(async () => {
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});

describe('Auth Routes', () => {
    it('should register a user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'test@gmail.com',
            password: 'password123'
        });

        //console.log(res);

        expect(res.statusCode).toBe(201);
        expect(res.body.user).toHaveProperty('email', 'test@gmail.com');
        expect(res.body).toHaveProperty('token');
    });

    it('should not allow duplicate registration', async () => {
        await request(app).post('/api/auth/register').send({
            email: 'test@gmail.com',
            password: 'password123'
        });

        const res = await request(app).post('/api/auth/register').send({
            email: 'test@gmail.com',
            password: 'password123'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Email already in use');
    });

    it('should login a registered user', async () => {
        await request(app).post('/api/auth/register').send({
            email: 'test@gmail.com',
            password: 'password123'
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'test@gmail.com',
            password: 'password123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail login with wrong password', async () => {
        await request(app).post('/api/auth/register').send({
            email: 'test@gmail.com',
            password: 'password123'
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'test@gmail.com',
            password: 'wrongpassword'
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });
});