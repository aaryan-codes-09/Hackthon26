const express  = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const Analysis  = require('../models/Analysis');

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/analyze
router.post('/', async (req, res) => {
  try {
    let { repo } = req.body;
    if (!repo) return res.status(400).json({ error: 'repo is required' });

    // Normalise: strip https://github.com/
    repo = repo.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
    if (!repo.includes('/')) return res.status(400).json({ error: 'Invalid repo format. Use owner/repo' });

    const prompt = buildPrompt(repo);

    const message = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages:   [{ role: 'user', content: prompt }],
    });

    const raw  = message.content.map(b => b.text || '').join('');
    const clean = raw.replace(/```json|```/gi, '').trim();
    const data  = JSON.parse(clean);

    // Persist to MongoDB (non-blocking)
    try {
      const doc = await Analysis.findOneAndUpdate(
        { repoName: data.repoName },
        { ...data, repoUrl: `https://github.com/${repo}` },
        { upsert: true, new: true }
      );
      return res.json({ ...data, _id: doc._id });
    } catch (_dbErr) {
      // MongoDB not available — still return AI result
      return res.json(data);
    }
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

function buildPrompt(repo) {
  return `You are a senior software architect. Analyze the GitHub repository "${repo}" and produce a detailed architecture analysis.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, no prose before or after):

{
  "repoName": "${repo}",
  "language": "primary language",
  "description": "2 sentence project description",
  "totalFiles": 42,
  "totalModules": 12,
  "linesOfCode": "~15k",
  "archSummary": "3-4 sentence AI summary of the overall architecture, design patterns used, and how components interact",
  "stats": {
    "entryPoints": 3,
    "coreModules": 8,
    "utilities": 12,
    "externalIntegrations": 5
  },
  "files": [
    {
      "id": "f1",
      "name": "index.js",
      "path": "src/index.js",
      "type": "entry",
      "summary": "Main application entry point. Bootstraps the server and mounts all middleware.",
      "imports": ["f2","f3"],
      "usedBy": [],
      "highImpact": true,
      "x": 120, "y": 200
    }
  ],
  "onboardingPath": [
    {
      "fileId": "f1",
      "filename": "src/index.js",
      "reason": "Start here — it is the application entry point that shows how everything connects"
    }
  ],
  "modules": {
    "entries": ["src/index.js","src/server.js"],
    "core": ["src/routes/api.js","src/models/User.js"],
    "utilities": ["src/utils/logger.js","src/helpers/validate.js"],
    "external": ["src/services/stripe.js","src/services/aws.js"]
  }
}

Strict rules:
- Generate 18-28 realistic files that actually exist in "${repo}"
- Spread x coords: entry points 80-180, core 250-500, util 550-750, external 800-950
- Spread y coords randomly between 60 and 500
- type must be one of: entry, core, util, external, config
- highImpact: true only for files imported by 3 or more others
- imports array contains IDs of other files this file depends on
- onboardingPath: 7-10 files in ideal first-time reading order
- Be specific to "${repo}" — use real filenames you know about this project`;
}

module.exports = router;
