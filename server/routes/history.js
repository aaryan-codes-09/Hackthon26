const express  = require('express');
const Analysis = require('../models/Analysis');

const router = express.Router();

// GET /api/history  – last 20 analyses
router.get('/', async (_req, res) => {
  try {
    const items = await Analysis.find({}, 'repoName language description totalFiles linesOfCode createdAt')
      .sort({ createdAt: -1 }).limit(20);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/history/:id  – full analysis
router.get('/:id', async (req, res) => {
  try {
    const doc = await Analysis.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history/:id
router.delete('/:id', async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
