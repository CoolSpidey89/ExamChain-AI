const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'examchain_secret_key';

// Teacher Register
router.post('/teacher/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: 'teacher' });
    await user.save();

    const token = jwt.sign({ id: user._id, name, email, role: 'teacher' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name, email, role: 'teacher' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Teacher Login
router.post('/teacher/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'teacher' });
    if (!user) return res.status(400).json({ error: 'Teacher not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, name: user.name, email, role: 'teacher' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { name: user.name, email, role: 'teacher' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student Register
router.post('/student/register', async (req, res) => {
  try {
    const { name, email, rollNumber, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: 'student', rollNumber });
    await user.save();

    const token = jwt.sign(
      { id: user._id, name, email, role: 'student', rollNumber },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { name, email, role: 'student', rollNumber } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student Login
router.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'student' });
    if (!user) return res.status(400).json({ error: 'Student not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, name: user.name, email, role: 'student', rollNumber: user.rollNumber },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { name: user.name, email, role: 'student', rollNumber: user.rollNumber } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;