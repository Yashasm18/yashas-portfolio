import { useEffect, useState, useRef, useMemo } from "react";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/GitHubActivity.css";

gsap.registerPlugin(ScrollTrigger);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Map contribution level to purple palette
function getLevelColor(count) {
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
  const graphRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch("/api/github", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("API error");
        const json = await res.json();

        if (json.error) throw new Error(json.error);
        if (!json.calendar?.weeks?.length) throw new Error("No calendar data");

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
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // GSAP entrance animation
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
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      tl.fromTo(
        ".github-stats-row",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      );

      tl.fromTo(
        ".github-graph-container",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, error, data]);

  // Compute month positions across the 53 week columns
  const monthLabels = useMemo(() => {
    if (!data?.calendar?.weeks) return [];
    const labels = [];
    let lastMonth = -1;

    data.calendar.weeks.forEach((week, weekIdx) => {
      const firstDay = week.contributionDays?.[0];
      if (firstDay?.date) {
        const d = new Date(firstDay.date + "T00:00:00Z");
        const month = d.getUTCMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], weekIdx });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [data]);

  const handleMouseMove = (e, day) => {
    if (!graphRef.current) return;
    const bounds = graphRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const dateObj = new Date(day.date + "T00:00:00Z");
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

    const countText =
      day.contributionCount === 0
        ? "No contributions"
        : `${day.contributionCount} contribution${day.contributionCount > 1 ? "s" : ""}`;

    setTooltip({
      visible: true,
      x,
      y,
      text: `${countText} on ${formattedDate}`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  if (error || (!loading && !data)) {
    return null; // Gracefully collapse if API fails
  }

  if (loading) {
    return (
      <div className="github-activity-section section-container" ref={sectionRef} data-cursor="disable">
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
      data-cursor="disable"
    >
      {/* Header */}
      <div className="github-activity-header" data-cursor="disable">
        <div className="github-header-left">
          <div className="github-icon-badge">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <div>
            <h3>GitHub Contributions</h3>
            <p className="github-subtitle">
              Live activity from{" "}
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

      {/* Stats Cards */}
      <div className="github-stats-row" data-cursor="disable">
        <div className="github-stat-card">
          <span className="github-stat-value">{data.totalContributions.toLocaleString()}</span>
          <span className="github-stat-label">Contributions</span>
        </div>
        <div className="github-stat-divider" />
        <div className="github-stat-card">
          <span className="github-stat-value">{data.currentStreak} Days</span>
          <span className="github-stat-label">Current Streak 🔥</span>
        </div>
        <div className="github-stat-divider" />
        <div className="github-stat-card">
          <span className="github-stat-value">{data.longestStreak} Days</span>
          <span className="github-stat-label">Longest Streak</span>
        </div>
      </div>

      {/* Main Contribution Graph */}
      <div className="github-graph-container" ref={graphRef} data-cursor="disable">
        {/* Floating Tooltip */}
        {tooltip.visible && (
          <div
            className="github-tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 12}px`,
            }}
          >
            {tooltip.text}
          </div>
        )}

        <div className="github-graph-scroll">
          <div className="github-calendar">
            {/* Month Header */}
            <div className="github-months-row">
              <div className="github-day-spacer" />
              <div className="github-months-grid">
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
            </div>

            {/* Calendar Body */}
            <div className="github-body-row">
              {/* Day Labels Column */}
              <div className="github-days-column">
                <span></span>
                <span>Mon</span>
                <span></span>
                <span>Wed</span>
                <span></span>
                <span>Fri</span>
                <span></span>
              </div>

              {/* Weeks Grid */}
              <div className="github-weeks-grid">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="github-week-col">
                    {week.contributionDays.map((day, dIdx) => {
                      const color = day.color || getLevelColor(day.contributionCount);
                      return (
                        <div
                          key={dIdx}
                          className="github-day-cell"
                          style={{ backgroundColor: color }}
                          onMouseMove={(e) => handleMouseMove(e, day)}
                          onMouseLeave={handleMouseLeave}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="github-legend">
          <span className="github-legend-label">Less</span>
          <div className="github-day-cell legend-cell" style={{ backgroundColor: "var(--gh-level-0)" }} />
          <div className="github-day-cell legend-cell" style={{ backgroundColor: "var(--gh-level-1)" }} />
          <div className="github-day-cell legend-cell" style={{ backgroundColor: "var(--gh-level-2)" }} />
          <div className="github-day-cell legend-cell" style={{ backgroundColor: "var(--gh-level-3)" }} />
          <div className="github-day-cell legend-cell" style={{ backgroundColor: "var(--gh-level-4)" }} />
          <span className="github-legend-label">More</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubActivity;
