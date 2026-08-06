export default async function handler(req, res) {
  // Allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || 'Yashasm18';

  if (!token) {
    return res.status(500).json({ error: 'Missing GITHUB_TOKEN in environment variables' });
  }

  try {
    // Fetch last 1 year of contributions
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

    if (!response.ok || data.errors) {
      const errorMsg = data.errors?.[0]?.message || data.message || 'GitHub API error';
      return res.status(response.ok ? 400 : response.status).json({ error: errorMsg });
    }

    const collection = data.data?.user?.contributionsCollection;

    if (!collection) {
      return res.status(404).json({ error: 'User not found or no contribution data' });
    }

    // Compute streak
    const allDays = collection.contributionCalendar.weeks
      .flatMap(w => w.contributionDays)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Current streak: count backwards from today (skip today if no contributions yet)
    const today = new Date().toISOString().split('T')[0];
    let startIdx = 0;
    if (allDays[0]?.date === today && allDays[0]?.contributionCount === 0) {
      startIdx = 1; // skip today if nothing committed yet
    }
    for (let i = startIdx; i < allDays.length; i++) {
      if (allDays[i].contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Longest streak: scan all days oldest-first
    const chronological = [...allDays].reverse();
    for (const day of chronological) {
      if (day.contributionCount > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Cache for 30 minutes
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      totalContributions: collection.totalContributions,
      currentStreak,
      longestStreak,
      calendar: collection.contributionCalendar,
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
