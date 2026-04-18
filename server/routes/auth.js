const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'reponav_dev_secret_change_in_prod';

function signToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email }).catch(() => null);
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password }).catch(() => null);
    // If MongoDB is not available, return a mock user for demo
    if (!user) {
      const token = signToken('demo_' + Date.now());
      return res.json({ token, user: { id: 'demo', name, email, avatar: '' } });
    }

    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ email }).catch(() => null);

    // Demo mode — MongoDB not available
    if (!user && email === 'demo@reponav.dev' && password === 'demo123') {
      const token = signToken('demo_user');
      return res.json({ token, user: { id: 'demo_user', name: 'Demo User', email, avatar: '' } });
    }

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me  (protected)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password').catch(() => null);
    if (!user && decoded.id.startsWith('demo')) {
      return res.json({ id: decoded.id, name: 'Demo User', email: 'demo@reponav.dev', avatar: '' });
    }
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
