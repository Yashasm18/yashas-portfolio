export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const username = process.env.GITHUB_USERNAME || 'Yashasm18';

  try {
    // ─── Strategy 1: Use GITHUB_TOKEN if available (GraphQL) ───
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const result = await fetchWithGraphQL(username, token);
      if (result) {
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(result);
      }
    }

    // ─── Strategy 2: Scrape GitHub's public profile page (Exact HTML Parser) ───
    const result = await fetchFromPublicProfile(username);
    if (result) {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
      return res.status(200).json(result);
    }

    return res.status(500).json({ error: 'Could not fetch contribution data' });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

// ─── GraphQL approach ───
async function fetchWithGraphQL(username, token) {
  try {
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
        'User-Agent': 'yashas-portfolio',
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
    if (!response.ok || data.errors) return null;

    const collection = data.data?.user?.contributionsCollection;
    if (!collection) return null;

    return buildResponse(collection.contributionCalendar, collection.totalContributions);
  } catch {
    return null;
  }
}

// ─── Exact Public Profile HTML Parser ───
async function fetchFromPublicProfile(username) {
  try {
    const url = `https://github.com/users/${username}/contributions`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) return null;
    const html = await response.text();

    const daysByDate = {};

    // Exact match for <td ... data-date="YYYY-MM-DD" ... data-level="L"> followed by <tool-tip>text</tool-tip>
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

    // Total contributions from page heading or summed
    let totalContributions = dates.reduce((sum, d) => sum + daysByDate[d].count, 0);
    const totalHeadingMatch = html.match(/(\d[\d,]*)\s+contributions?\s+in\s+the\s+last\s+year/i);
    if (totalHeadingMatch) {
      totalContributions = parseInt(totalHeadingMatch[1].replace(/,/g, ''), 10);
    }

    // Group chronologically into Sunday-Saturday weeks
    const weeks = [];
    let currentWeek = [];

    for (const date of dates) {
      const d = new Date(date + 'T00:00:00Z');
      const dayOfWeek = d.getUTCDay(); // 0 = Sunday

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

    if (currentWeek.length > 0) {
      weeks.push({ contributionDays: currentWeek });
    }

    const calendar = { totalContributions, weeks };
    return buildResponse(calendar, totalContributions);
  } catch (err) {
    console.error('Public profile scraping failed:', err);
    return null;
  }
}

function levelToColor(level) {
  const colors = [
    'rgba(255, 255, 255, 0.04)', // level 0
    'rgba(162, 120, 255, 0.35)', // level 1
    'rgba(162, 120, 255, 0.60)', // level 2
    'rgba(174, 138, 255, 0.85)', // level 3
    '#c2a4ff',                  // level 4
  ];
  return colors[level] || colors[0];
}

function buildResponse(calendar, totalContributions) {
  const allDays = calendar.weeks
    .flatMap(w => w.contributionDays)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

  const dates = allDays.map(d => d.date).sort();

  // Current streak
  let currentStreak = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  let startIdx = 0;
  // If today has 0 contributions so far, check starting from yesterday
  if (allDays[0]?.date === todayStr && allDays[0]?.contributionCount === 0) {
    startIdx = 1;
  }

  for (let i = startIdx; i < allDays.length; i++) {
    if (allDays[i].contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Longest streak
  let longestStreak = 0;
  let tempStreak = 0;

  for (const dateStr of dates) {
    const dayObj = allDays.find(d => d.date === dateStr);
    if (dayObj && dayObj.contributionCount > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    calendar,
  };
}
