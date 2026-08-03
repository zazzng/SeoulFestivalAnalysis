import { useEffect, useRef, useState } from "react";
import "./EndingPage.css";

interface EventStats {
  totalEvents: number;
  byClassification: Record<string, number>;
  byBorough: Record<string, number>;
  byTheme: Record<string, number>;
  seasons: {
    spring: number;
    summer: number;
    fall: number;
    winter: number;
  };
}

export default function EndingPage() {
  const [stats, setStats] = useState<EventStats>({
    totalEvents: 0,
    byClassification: {},
    byBorough: {},
    byTheme: {},
    seasons: { spring: 0, summer: 0, fall: 0, winter: 0 },
  });
  const [events, setEvents] = useState<any[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/seoul.events.json`);
        const data = await res.json();
        setEvents(data);
        calculateStats(data);
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    }
    loadData();
  }, []);

  const calculateStats = (eventList: any[]) => {
    const stats: EventStats = {
      totalEvents: eventList.length,
      byClassification: {},
      byBorough: {},
      byTheme: {},
      seasons: { spring: 0, summer: 0, fall: 0, winter: 0 },
    };

    eventList.forEach((event) => {
      // Count by classification
      if (event.classification) {
        stats.byClassification[event.classification] =
          (stats.byClassification[event.classification] || 0) + 1;
      }

      // Count by borough
      if (event.borough) {
        stats.byBorough[event.borough] = (stats.byBorough[event.borough] || 0) + 1;
      }

      // Count by theme
      if (event["Theme classification"]) {
        stats.byTheme[event["Theme classification"]] =
          (stats.byTheme[event["Theme classification"]] || 0) + 1;
      }

      // Count by season
      if (event["start date"]) {
        const month = parseInt(event["start date"].split("-")[1]);
        if (month >= 3 && month <= 5) stats.seasons.spring++;
        else if (month >= 6 && month <= 8) stats.seasons.summer++;
        else if (month >= 9 && month <= 11) stats.seasons.fall++;
        else stats.seasons.winter++;
      }
    });

    setStats(stats);
  };

  const topClassifications = Object.entries(stats.byClassification)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topBoroughs = Object.entries(stats.byBorough)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="ending-page" ref={sectionRef}>
      {/* HERO SECTION */}
      <section className="ending-hero">
        <div className="ending-hero-content">
          <h1 className="ending-title">Your Perfect Seoul Trip</h1>
          <p className="ending-subtitle">Depends on Timing</p>
          <p className="ending-description">
            Seoul never stops surprising. With <span className="highlight">{stats.totalEvents}</span> cultural events across the city,
            there's always something happening, somewhere that matches your travel vibe.
          </p>
        </div>
        <div className="ending-hero-overlay" />
      </section>

      {/* STATS GRID */}
      <section className="ending-stats">
        <div className="stats-grid">
          {/* Total Events */}
          <div className="stat-card">
            <div className="stat-number">{stats.totalEvents}</div>
            <div className="stat-label">Total Events</div>
            <div className="stat-subtext">Across all seasons and boroughs</div>
          </div>

          {/* Seasons */}
          <div className="stat-card">
            <div className="season-mini-grid">
              <div className="season-item">
                <div className="season-number">{stats.seasons.spring}</div>
                <div className="season-name">Spring</div>
              </div>
              <div className="season-item">
                <div className="season-number">{stats.seasons.summer}</div>
                <div className="season-name">Summer</div>
              </div>
              <div className="season-item">
                <div className="season-number">{stats.seasons.fall}</div>
                <div className="season-name">Fall</div>
              </div>
              <div className="season-item">
                <div className="season-number">{stats.seasons.winter}</div>
                <div className="season-name">Winter</div>
              </div>
            </div>
            <div className="stat-label">Events by Season</div>
          </div>

          {/* Boroughs */}
          <div className="stat-card">
            <div className="stat-number">{Object.keys(stats.byBorough).length}</div>
            <div className="stat-label">Boroughs</div>
            <div className="stat-subtext">Represented in this collection</div>
          </div>
        </div>
      </section>

      {/* TOP CLASSIFICATIONS */}
      <section className="ending-section">
        <h2 className="section-title">Top Event Types</h2>
        <div className="top-list">
          {topClassifications.map(([type, count], idx) => (
            <div key={idx} className="top-item">
              <div className="top-rank">{idx + 1}</div>
              <div className="top-info">
                <div className="top-name">{type}</div>
                <div className="top-count">{count} events</div>
              </div>
              <div className="top-bar">
                <div
                  className="top-bar-fill"
                  style={{
                    width: `${(count / topClassifications[0][1]) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP BOROUGHS */}
      <section className="ending-section">
        <h2 className="section-title">Most Active Boroughs</h2>
        <div className="top-list">
          {topBoroughs.map(([borough, count], idx) => (
            <div key={idx} className="top-item">
              <div className="top-rank">{idx + 1}</div>
              <div className="top-info">
                <div className="top-name">{borough}</div>
                <div className="top-count">{count} events</div>
              </div>
              <div className="top-bar">
                <div
                  className="top-bar-fill"
                  style={{
                    width: `${(count / topBoroughs[0][1]) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP THEMES */}
      {/* <section className="ending-section">
        <h2 className="section-title">Popular Themes</h2>
        <div className="top-list">
          {topThemes.map(([theme, count], idx) => (
            <div key={idx} className="top-item">
              <div className="top-rank">{idx + 1}</div>
              <div className="top-info">
                <div className="top-name">{theme}</div>
                <div className="top-count">{count} events</div>
              </div>
              <div className="top-bar">
                <div
                  className="top-bar-fill"
                  style={{
                    width: `${(count / topThemes[0][1]) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* KEY INSIGHTS */}
      <section className="ending-insights">
        <h2 className="section-title">Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card insight-1">
            <div className="insight-icon">🎭</div>
            <h3>Cultural Diversity</h3>
            <p>
              From traditional performances to modern art installations, Seoul offers{" "}
              <strong>{Object.keys(stats.byClassification).length}</strong> different types of cultural events.
            </p>
          </div>

          <div className="insight-card insight-2">
            <div className="insight-icon">📍</div>
            <h3>Distributed Across City</h3>
            <p>
              Events happen in <strong>{Object.keys(stats.byBorough).length}</strong> boroughs, ensuring
              that no matter where you are, there's always something nearby to discover.
            </p>
          </div>

          <div className="insight-card insight-3">
            <div className="insight-icon">📅</div>
            <h3>Year-Round Activity</h3>
            <p>
              Each season brings its own flavor. From{" "}
              <strong>{stats.seasons.spring}</strong> spring awakening to <strong>{stats.seasons.summer}</strong> summer energy,
              Seoul transforms with the seasons.
            </p>
          </div>

          <div className="insight-card insight-4">
            <div className="insight-icon">✨</div>
            <h3>Your Perfect Match</h3>
            <p>
              With such abundance of choice, your perfect Seoul experience isn't random - it's about
              finding the right <em>timing</em> and <em>place</em> that matches your travel vibe.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SAMPLE */}
      <section className="ending-section">
        <h2 className="section-title">Recent Events to Explore</h2>
        <div className="featured-events">
          {events.slice(0, 6).map((event, idx) => (
            <div key={idx} className="featured-event-card">
              <div className="event-image-wrapper">
                {event["Representative image"] ? (
                  <img
                    src={event["Representative image"]}
                    alt={event["Performance/event name"]}
                    className="event-image"
                  />
                ) : (
                  <div className="event-image-placeholder">📸</div>
                )}
              </div>
              <div className="event-details">
                <div className="event-type">{event.classification}</div>
                <h4 className="event-title">{event["Performance/event name"]}</h4>
                <div className="event-location">{event.borough}</div>
                <div className="event-date">{event["Date/Time"]}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="ending-cta">
        <div className="cta-content">
          <h2>Ready to Plan Your Seoul Adventure?</h2>
          <p>
            Use the tools above to explore events by season, borough, and theme.
            Your perfect trip is waiting - discover it now.
          </p>
          <button className="cta-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Start Exploring
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ending-footer">
        <p>
          Designed for travelers who believe <em>timing is everything</em>
        </p>
        <p className="footer-small">
          Data source: Seoul Culture & Tourism / Fall 2025 ID 418 Data Analysis for Designer
        </p>
      </footer>
    </div>
  );
}
