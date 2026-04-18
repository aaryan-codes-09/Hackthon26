require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const analyzeRoutes = require('./routes/analyze');
const historyRoutes = require('./routes/history');
const queryRoutes   = require('./routes/query');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json({ limit: '2mb' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 60_000, max: 30, message: { error: 'Too many requests, slow down.' } });
app.use('/api', limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/analyze',  analyzeRoutes);
app.use('/api/history',  historyRoutes);
app.use('/api/query',    queryRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── MongoDB ───────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reponav';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.warn('⚠️  MongoDB not connected – history features disabled:', err.message);
  });

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 RepoNav server running on http://localhost:${PORT}`));
