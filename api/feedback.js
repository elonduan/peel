export default async function handler(req, res) {
  // 1. CORS Headers (Allows your GitHub site to talk to Vercel)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Safety Check: Is the API Key missing in Vercel Settings?
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY in Vercel settings." });
  }

  try {
    const { paragraph } = req.body;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a Social Studies teacher. Review this PEEL paragraph and give specific, encouraging feedback: ${paragraph}` }] }]
      })
    });

    const data = await response.json();

    // 3. Handle Google API errors (like expired keys)
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const aiText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ feedback: aiText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server crashed: " + error.message });
  }
}
