export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const username = process.env.GITHUB_USERNAME || 'Yashasm18';

  try {
    // ─── Strategy 1: Use GITHUB_TOKEN if available (full GraphQL data) ───
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const result = await fetchWithGraphQL(username, token);
      if (result) {
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
        return res.status(200).json(result);
      }
    }

    // ─── Strategy 2: Scrape GitHub's public profile page (no token needed) ───
    const result = await fetchFromPublicProfile(username);
    if (result) {
      res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
      return res.status(200).json(result);
    }

    return res.status(500).json({ error: 'Could not fetch contribution data' });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

// ─── GraphQL approach (requires token) ───
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

// ─── Public profile scraping approach (no token needed) ───
async function fetchFromPublicProfile(username) {
  try {
    // GitHub serves the contribution calendar as an HTML fragment
    const url = `https://github.com/users/${username}/contributions`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; yashas-portfolio/1.0)',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) return null;
    const html = await response.text();

    // Parse contribution data from the HTML using regex
    // Each day is a <td> with data-date and data-level attributes
    const dayRegex = /data-date="([^"]+)"[^>]*data-level="([^"]+)"/g;
    const weeks = [];
    let currentWeek = [];
    let totalContributions = 0;
    let match;
    const allDays = [];

    while ((match = dayRegex.exec(html)) !== null) {
      const date = match[1];
      const level = parseInt(match[2], 10);

      // Estimate contribution count from level
      const countMap = { 0: 0, 1: 1, 2: 3, 3: 6, 4: 10 };
      const contributionCount = countMap[level] ?? 0;

      // Also try to extract the actual count from the tooltip
      // Look backwards in the html for a count near this date
      const countRegex = new RegExp(`(\\d+) contributions? on`);
      const nearbyHtml = html.substring(Math.max(0, match.index - 200), match.index + match[0].length);
      const countMatch = countRegex.exec(nearbyHtml);
      const actualCount = countMatch ? parseInt(countMatch[1], 10) : contributionCount;

      const dayData = {
        date,
        contributionCount: actualCount,
        weekday: new Date(date).getDay(),
        color: levelToColor(level),
      };

      allDays.push(dayData);
      totalContributions += actualCount;
      currentWeek.push(dayData);

      if (currentWeek.length === 7) {
        weeks.push({ contributionDays: currentWeek });
        currentWeek = [];
      }
    }

    // Push any remaining partial week
    if (currentWeek.length > 0) {
      weeks.push({ contributionDays: currentWeek });
    }

    if (weeks.length === 0) return null;

    // Also try to get total from the page heading
    const totalRegex = /(\d[\d,]*)\s+contributions?\s+in\s+the\s+last\s+year/i;
    const totalMatch = totalRegex.exec(html);
    if (totalMatch) {
      totalContributions = parseInt(totalMatch[1].replace(/,/g, ''), 10);
    }

    const calendar = { totalContributions, weeks };
    return buildResponse(calendar, totalContributions);
  } catch {
    return null;
  }
}

function levelToColor(level) {
  const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  return colors[level] || colors[0];
}

function buildResponse(calendar, totalContributions) {
  const allDays = calendar.weeks
    .flatMap(w => w.contributionDays)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

  // Current streak
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  let startIdx = 0;
  if (allDays[0]?.date === today && allDays[0]?.contributionCount === 0) {
    startIdx = 1;
  }
  for (let i = startIdx; i < allDays.length; i++) {
    if (allDays[i].contributionCount > 0) currentStreak++;
    else break;
  }

  // Longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const chronological = [...allDays].reverse();
  for (const day of chronological) {
    if (day.contributionCount > 0) {
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
