import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const allowedEmotions = [
  'joyful',
  'neutral',
  'anxious',
  'sad',
  'angry',
  'hopeful',
  'overwhelmed',
  'calm',
];

router.post('/', async (req, res) => {
  const { message, history = [], language = 'en-US' } = req.body || {};

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server missing Gemini configuration.' });
  }

  if (typeof message !== 'string' || message.trim().length < 2 || message.trim().length > 1500) {
    return res.status(400).json({ error: 'Message must be a string between 2 and 1500 characters.' });
  }

  if (!Array.isArray(history) || history.length > 20) {
    return res.status(400).json({ error: 'History must be an array with up to 20 items.' });
  }

  const modelHistory = history
    .filter((entry) => entry && typeof entry.text === 'string' && ['user', 'assistant'].includes(entry.role))
    .slice(-10)
    .map((entry) => `${entry.role === 'assistant' ? 'companion' : 'user'}: ${entry.text}`)
    .join('\n');

  const prompt = `
You are Karna, a kind and practical AI mental wellness companion.
Respond in language code: ${language}.

Conversation history:
${modelHistory || 'No prior history'}

Latest user message:
${message.trim()}

Return ONLY strict JSON with keys:
- reply (string, <= 180 tokens, empathetic and practical)
- emotion (one of: ${allowedEmotions.join(', ')})

Safety rules:
- If the user suggests self-harm, violence, or crisis, encourage immediate local emergency/professional help and supportive next steps.
- Do not diagnose medical conditions.
`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const response = await model.generateContent(prompt);
    const raw = response.response.text();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : '';
    const emotion = allowedEmotions.includes(parsed.emotion) ? parsed.emotion : 'neutral';

    if (!reply) {
      throw new Error('Invalid model response');
    }

    return res.json({ reply, emotion });
  } catch (error) {
    return res.status(502).json({ error: 'Unable to generate chat response at the moment.' });
  }
});

export default router;
