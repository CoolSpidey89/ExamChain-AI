require('dotenv').config({ path: __dirname + '/../.env' });
const axios = require('axios');

async function generateVariants(original, concept, difficulty) {
  console.log('API KEY:', process.env.OPENROUTER_API_KEY ? 'Found' : 'MISSING');

  const prompt = `You are an exam question generator.

Given this base question:
"${original}"

Concept: ${concept}
Difficulty level: ${difficulty}/5

Generate 5 unique variants of this question. Each variant must:
- Test the same concept at the same difficulty
- Have 4 answer options (A, B, C, D)
- Have exactly one correct answer
- Be worded differently so students cannot share answers

Respond ONLY with a valid JSON array, no markdown, no explanation:
[
  {
    "questionText": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A"
  }
]`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-oss-120b:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ExamChain'
        }
      }
    );

    const raw = response.data.choices[0].message.content;
    console.log('LLM raw response:', raw);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('LLM Error:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { generateVariants };