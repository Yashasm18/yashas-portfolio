import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev middleware to proxy /api/chat to Gemini API
function geminiApiPlugin(env) {
  return {
    name: 'gemini-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { messages } = JSON.parse(body);
            const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Missing VITE_GEMINI_API_KEY in .env' }));
              return;
            }

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
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                systemInstruction,
                contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 512
                }
              }),
            });

            const data = await response.json();
            
            res.setHeader('Content-Type', 'application/json');
            
            if (!response.ok) {
              res.statusCode = response.status;
              res.end(JSON.stringify({ error: data.error?.message || 'Failed to fetch from Gemini' }));
              return;
            }

            // Map back to OpenAI format for frontend compatibility
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
            
            res.statusCode = 200;
            res.end(JSON.stringify({
                choices: [
                    {
                        message: {
                            content: replyText
                        }
                    }
                ]
            }));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), geminiApiPlugin(env)],
  }
})
