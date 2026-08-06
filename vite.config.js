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

// Local dev middleware to proxy /api/github — works with or without a token
function githubApiPlugin(env) {
  return {
    name: 'github-api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/github', async (req, res) => {
        const username = env.GITHUB_USERNAME || 'Yashasm18';
        res.setHeader('Content-Type', 'application/json');

        try {
          // Strategy 1: Use token if available
          const token = env.GITHUB_TOKEN;
          if (token) {
            const result = await fetchGraphQL(username, token);
            if (result) {
              res.statusCode = 200;
              res.end(JSON.stringify(result));
              return;
            }
          }

          // Strategy 2: Scrape public profile (no token needed)
          const result = await fetchPublicProfile(username);
          if (result) {
            res.statusCode = 200;
            res.end(JSON.stringify(result));
            return;
          }

          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Could not fetch GitHub data' }));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}

async function fetchGraphQL(username, token) {
  try {
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const query = `query($u:String!,$f:DateTime!,$t:DateTime!){user(login:$u){contributionsCollection(from:$f,to:$t){totalContributions contributionCalendar{totalContributions weeks{contributionDays{contributionCount date weekday color}}}}}}`;
    const resp = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'yashas-portfolio' },
      body: JSON.stringify({ query, variables: { u: username, f: oneYearAgo.toISOString(), t: now.toISOString() } }),
    });
    const data = await resp.json();
    if (!resp.ok || data.errors) return null;
    const col = data.data?.user?.contributionsCollection;
    if (!col) return null;
    return buildStreaks(col.contributionCalendar, col.totalContributions);
  } catch { return null; }
}

async function fetchPublicProfile(username) {
  try {
    const resp = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    const daysByDate = {};
    const cellRegex = /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"[^>]*>[\s\S]*?<tool-tip[^>]*>([\s\S]*?)<\/tool-tip>/g;

    let match;
    while ((match = cellRegex.exec(html)) !== null) {
      const date = match[1];
      const level = parseInt(match[2], 10);
      const tipText = match[3].trim();
      let count = 0;
      const countMatch = tipText.match(/^([\d,]+)\s+contribution/i);
      if (countMatch) {
        count = parseInt(countMatch[1].replace(/,/g, ''), 10);
      }
      daysByDate[date] = { date, level, count };
    }

    const dates = Object.keys(daysByDate).sort();
    if (dates.length === 0) return null;

    let total = dates.reduce((sum, d) => sum + daysByDate[d].count, 0);
    const totalMatch = /(\d[\d,]*)\s+contributions?\s+in\s+the\s+last\s+year/i.exec(html);
    if (totalMatch) total = parseInt(totalMatch[1].replace(/,/g, ''), 10);

    const weeks = [];
    let currentWeek = [];

    for (const date of dates) {
      const d = new Date(date + 'T00:00:00Z');
      const dayOfWeek = d.getUTCDay();
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push({ contributionDays: currentWeek });
        currentWeek = [];
      }
      currentWeek.push({
        date,
        contributionCount: daysByDate[date].count,
        weekday: dayOfWeek,
        color: levelToColor(daysByDate[date].level),
      });
    }
    if (currentWeek.length > 0) weeks.push({ contributionDays: currentWeek });

    return buildStreaks({ totalContributions: total, weeks }, total);
  } catch { return null; }
}

function levelToColor(level) {
  const colors = ['rgba(255, 255, 255, 0.04)', 'rgba(162, 120, 255, 0.35)', 'rgba(162, 120, 255, 0.60)', 'rgba(174, 138, 255, 0.85)', '#c2a4ff'];
  return colors[level] || colors[0];
}

function buildStreaks(calendar, totalContributions) {
  const allDays = calendar.weeks.flatMap(w => w.contributionDays).sort((a, b) => new Date(b.date) - new Date(a.date));
  const dates = allDays.map(d => d.date).sort();
  let currentStreak = 0, longestStreak = 0, tempStreak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  let start = (allDays[0]?.date === todayStr && allDays[0]?.contributionCount === 0) ? 1 : 0;
  for (let i = start; i < allDays.length; i++) {
    if (allDays[i].contributionCount > 0) currentStreak++;
    else break;
  }
  for (const dateStr of dates) {
    const dayObj = allDays.find(d => d.date === dateStr);
    if (dayObj && dayObj.contributionCount > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  return { totalContributions, currentStreak, longestStreak, calendar };
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
