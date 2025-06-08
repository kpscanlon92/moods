import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

router.post('/users/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        const token = generateToken(user);

        res.status(201).json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });

    res.json({ token, user: { id: user._id, email: user.email } });
});


router.post('/users/update-password', authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/users/me', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ email: user.email });
});

router.post('/users/change-email', authMiddleware, async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await User.findById(req.user.id);
        user.email = email;
        await user.save();
        res.json({ message: 'Email updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/users/delete', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete account' });
    }
});


export default router;