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

// Local dev middleware to proxy /api/github to GitHub GraphQL API
function githubApiPlugin(env) {
  return {
    name: 'github-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/github', async (req, res) => {
        try {
          const token = env.GITHUB_TOKEN;
          const username = env.GITHUB_USERNAME || 'Yashasm18';

          if (!token) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing GITHUB_TOKEN in .env' }));
            return;
          }

          const now = new Date();
          const oneYearAgo = new Date(now);
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

          const query = `
            query($username: String!, $from: DateTime!, $to: DateTime!) {
              user(login: $username) {
                contributionsCollection(from: $from, to: $to) {
                  totalContributions
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                        weekday
                        color
                      }
                    }
                  }
                }
              }
            }
          `;

          const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'User-Agent': 'yashas-portfolio-dev',
            },
            body: JSON.stringify({
              query,
              variables: {
                username,
                from: oneYearAgo.toISOString(),
                to: now.toISOString(),
              },
            }),
          });

          const data = await response.json();
          res.setHeader('Content-Type', 'application/json');

          if (!response.ok || data.errors) {
            res.statusCode = response.ok ? 400 : response.status;
            res.end(JSON.stringify({ error: data.errors?.[0]?.message || 'GitHub API error' }));
            return;
          }

          const collection = data.data?.user?.contributionsCollection;
          if (!collection) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
          }

          // Compute streaks
          const allDays = collection.contributionCalendar.weeks
            .flatMap(w => w.contributionDays)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          let currentStreak = 0;
          let longestStreak = 0;
          let tempStreak = 0;

          const today = new Date().toISOString().split('T')[0];
          let startIdx = 0;
          if (allDays[0]?.date === today && allDays[0]?.contributionCount === 0) {
            startIdx = 1;
          }
          for (let i = startIdx; i < allDays.length; i++) {
            if (allDays[i].contributionCount > 0) currentStreak++;
            else break;
          }

          const chronological = [...allDays].reverse();
          for (const day of chronological) {
            if (day.contributionCount > 0) {
              tempStreak++;
              longestStreak = Math.max(longestStreak, tempStreak);
            } else {
              tempStreak = 0;
            }
          }

          res.statusCode = 200;
          res.end(JSON.stringify({
            totalContributions: collection.totalContributions,
            currentStreak,
            longestStreak,
            calendar: collection.contributionCalendar,
          }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message }));
        }
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
    plugins: [react(), geminiApiPlugin(env), githubApiPlugin(env)],
  }
})
