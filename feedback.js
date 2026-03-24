// api/feedback.js
export default async function handler(req, res) {
  const { paragraph } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // This is hidden in Vercel settings

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `You are a Social Studies teacher. Grade this PEEL paragraph: ${paragraph}` }] }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
