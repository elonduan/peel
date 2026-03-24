export default async function handler(req, res) {
  // 1. Handle Preflight (Security check by browser)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Get the student's text
  const { paragraph } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  try {
    // 3. Talk to Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `You are a Social Studies teacher. Review this PEEL paragraph and give specific, encouraging feedback on how to improve the Point, Evidence, Explanation, and Link. Keep it short: ${paragraph}` 
          }] 
        }]
      })
    });

    const data = await response.json();
    
    // 4. Send the AI's answer back to your website
    const aiText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ feedback: aiText });
  } catch (error) {
    res.status(500).json({ error: "The AI is currently resting. Try again in a minute!" });
  }
}
