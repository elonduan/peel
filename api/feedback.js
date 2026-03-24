export default async function handler(req, res) {
  // CORS Headers (Lets GitHub talk to Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { paragraph } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  try {
    // 2. We use the 2026 model: gemini-3-flash-preview
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a Social Studies teacher. Review this PEEL paragraph and give specific feedback: ${paragraph}` }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
        return res.status(400).json({ error: data.error.message });
    }

    const aiText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ feedback: aiText });
  } catch (error) {
    res.status(500).json({ error: "AI Bridge failed: " + error.message });
  }
}
