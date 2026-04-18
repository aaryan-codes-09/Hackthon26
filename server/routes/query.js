const express  = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const Analysis  = require('../models/Analysis');

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/query
router.post('/', async (req, res) => {
  const { question, analysisId, repoContext } = req.body;
  if (!question) return res.status(400).json({ error: 'question is required' });

  try {
    let ctx = repoContext;

    // If we have an ID, try to load from DB
    if (analysisId && !ctx) {
      try {
        const doc = await Analysis.findById(analysisId);
        if (doc) ctx = {
          repoName: doc.repoName,
          files: doc.files,
          modules: doc.modules,
          archSummary: doc.archSummary,
        };
      } catch (_) {}
    }

    const contextStr = ctx ? JSON.stringify(ctx) : 'No context available';

    const message = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: `You are an expert on this codebase. Architecture context:\n${contextStr}\n\nQuestion: ${question}\n\nAnswer in 3-5 sentences, be specific and reference actual file names. Start directly with the answer.`,
      }],
    });

    const answer = message.content.map(b => b.text || '').join('').trim();

    // Save query to DB if we have an ID
    if (analysisId) {
      try {
        await Analysis.findByIdAndUpdate(analysisId, {
          $push: { queries: { question, answer } },
        });
      } catch (_) {}
    }

    res.json({ answer });
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: err.message || 'Query failed' });
  }
});

module.exports = router;
