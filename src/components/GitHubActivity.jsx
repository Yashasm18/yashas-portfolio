import { useEffect, useState, useRef, useMemo } from "react";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/GitHubActivity.css";

gsap.registerPlugin(ScrollTrigger);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

// Map contribution count to our purple palette
function mapColor(count) {
  if (count === 0) return "var(--gh-level-0)";
  if (count <= 2) return "var(--gh-level-1)";
  if (count <= 5) return "var(--gh-level-2)";
  if (count <= 9) return "var(--gh-level-3)";
  return "var(--gh-level-4)";
}

const GitHubActivity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const sectionRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });

  // Fetch contribution data with timeout
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch("/api/github", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("API error");
        const json = await res.json();

        if (json.error) throw new Error(json.error);
        if (!json.calendar?.weeks?.length) throw new Error("No data");

        if (!cancelled) {
          setData(json);
          setLoading(false);
          setError(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("GitHub activity fetch failed:", err.message);
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchData();
    // Refresh every 30 minutes to keep it live
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // GSAP scroll-triggered entrance animation
  useEffect(() => {
    if (loading || error || !data) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".github-activity-section",
          start: "top 85%",
          end: "bottom center",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        ".github-activity-header",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );

      tl.fromTo(
        ".github-stats-row",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );

      tl.fromTo(
        ".github-graph-container",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      );

      tl.fromTo(
        ".github-legend",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, error, data]);

  // Extract month labels from the calendar weeks
  const monthLabels = useMemo(() => {
    if (!data?.calendar?.weeks) return [];
    const labels = [];
    let lastMonth = -1;

    data.calendar.weeks.forEach((week, weekIdx) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], weekIdx });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [data]);

  function handleCellHover(e, day) {
    const rect = e.target.getBoundingClientRect();
    const parentRect = sectionRef.current?.getBoundingClientRect();
    if (!parentRect) return;

    const date = new Date(day.date + "T00:00:00");
    const formatted = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setTooltip({
      visible: true,
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top - 8,
      text: `${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""} on ${formatted}`,
    });
  }

  function handleCellLeave() {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }

  // ─── Render nothing if error or no data (zero height, no blank space) ───
  if (error || (!loading && !data)) {
    return null;
  }

  // ─── Loading skeleton ───
  if (loading) {
    return (
      <div className="github-activity-section section-container" ref={sectionRef}>
        <div className="github-activity-loading">
          <div className="github-loading-skeleton">
            <div className="skeleton-header" />
            <div className="skeleton-stats" />
            <div className="skeleton-graph" />
          </div>
        </div>
      </div>
    );
  }

  const weeks = data.calendar?.weeks || [];

  return (
    <div
      className="github-activity-section section-container"
      id="github"
      ref={sectionRef}
    >
      {/* Header */}
      <div className="github-activity-header">
        <div className="github-header-left">
          <div className="github-icon-pulse">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="pulse-ring" />
          </div>
          <div>
            <h3>GitHub Activity</h3>
            <p className="github-subtitle">
              Live contributions from{" "}
              <a
                href={config.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="disable"
              >
                @{config.social.github}
              </a>
            </p>
          </div>
        </div>
        <a
          href={config.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="github-profile-link"
          data-cursor="disable"
        >
          View Profile →
        </a>
      </div>

      {/* Stats Row */}
      <div className="github-stats-row">
        <div className="github-stat">
          <span className="github-stat-value">{data.totalContributions.toLocaleString()}</span>
          <span className="github-stat-label">Contributions</span>
        </div>
        <div className="github-stat-divider" />
        <div className="github-stat">
          <span className="github-stat-value">{data.currentStreak}</span>
          <span className="github-stat-label">Day Streak 🔥</span>
        </div>
        <div className="github-stat-divider" />
        <div className="github-stat">
          <span className="github-stat-value">{data.longestStreak}</span>
          <span className="github-stat-label">Longest Streak</span>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="github-graph-container">
        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="github-tooltip"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            {tooltip.text}
          </div>
        )}

        <div className="github-graph-scroll">
          {/* Month labels */}
          <div className="github-month-labels">
            <div className="github-day-label-spacer" />
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="github-month-label"
                style={{ gridColumnStart: m.weekIdx + 1 }}
              >
                {m.month}
              </span>
            ))}
          </div>

          <div className="github-graph-body">
            {/* Day labels */}
            <div className="github-day-labels">
              {DAYS.map((d, i) => (
                <span key={i} className="github-day-label">
                  {d}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="github-grid">
              {weeks.map((week, wi) => (
                <div key={wi} className="github-week">
                  {week.contributionDays.map((day, di) => (
                    <div
                      key={di}
                      className="github-cell"
                      style={{ backgroundColor: mapColor(day.contributionCount) }}
                      onMouseEnter={(e) => handleCellHover(e, day)}
                      onMouseLeave={handleCellLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="github-legend">
          <span className="github-legend-text">Less</span>
          <div className="github-cell" style={{ backgroundColor: "var(--gh-level-0)" }} />
          <div className="github-cell" style={{ backgroundColor: "var(--gh-level-1)" }} />
          <div className="github-cell" style={{ backgroundColor: "var(--gh-level-2)" }} />
          <div className="github-cell" style={{ backgroundColor: "var(--gh-level-3)" }} />
          <div className="github-cell" style={{ backgroundColor: "var(--gh-level-4)" }} />
          <span className="github-legend-text">More</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubActivity;
