export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing Gemini API Key' });
    }

    try {
        // Extract system prompt
        const systemMessage = messages.find(m => m.role === 'system');
        const systemInstruction = systemMessage ? {
            parts: [{ text: systemMessage.content }]
        } : undefined;

        // Map messages to Gemini format
        const contents = messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                systemInstruction,
                contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 512
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch from Gemini');
        }

        // Map back to OpenAI format for frontend compatibility
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
        
        return res.status(200).json({
            choices: [
                {
                    message: {
                        content: replyText
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
