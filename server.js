const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GenerateDocs page
app.get('/GenerateDocs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'GenerateDocs', 'index.html'));
});

// AI proxy — keeps OpenRouter API key hidden from browser
app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Service not configured. Add OPENROUTER_API_KEY to Vercel environment variables.' });
  }

  const { prompt, maxTokens = 520 } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  // Try models in order — fall back if one is down or rate-limited
  const MODELS = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-3-27b-it:free',
  ];

  let lastError = 'Failed to reach AI service. Please try again.';

  for (const model of MODELS) {
    try {
      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': req.headers.referer || req.headers.origin || 'https://globlearn.vercel.app',
          'X-Title': 'DocGen Pro'
        },
        body: JSON.stringify({
          model,
          max_tokens: Math.min(maxTokens, 1000),
          messages: [{ role: 'user', content: prompt }]
        })
      });

      // 429 = rate-limited on this model, try next
      if (orRes.status === 429) { lastError = 'Too many requests — please wait a moment.'; continue; }

      if (!orRes.ok) {
        try { const j = await orRes.json(); lastError = j.error?.message || `OpenRouter error ${orRes.status}`; } catch (_) {}
        // 5xx = model/server down, try next; 4xx (except 429) = bad request, stop
        if (orRes.status < 500) return res.status(orRes.status).json({ error: lastError });
        continue;
      }

      const data = await orRes.json();
      const text = (data.choices || []).map(c => c.message?.content || '').join('\n');
      return res.status(200).json({ text });

    } catch (err) {
      console.error(`OpenRouter error (${model}):`, err);
      lastError = 'Failed to reach AI service. Please try again.';
      // Network error — try next model
    }
  }

  return res.status(503).json({ error: lastError });
});

app.listen(PORT, () => {
  console.log(`Globlearn Education running on port ${PORT}`);
});
