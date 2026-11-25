import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AllClubs.css";

function AllClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8000/club/allClubs"
      );

      setClubs(
        Array.isArray(response.data.clubs)
          ? response.data.clubs
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load clubs. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        clubs
          .map((club) => club.category)
          .filter(Boolean)
      )
    ];
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return clubs.filter((club) => {
      const matchesSearch =
        (club.clubName || "").toLowerCase().includes(searchText) ||
        (club.description || "").toLowerCase().includes(searchText) ||
        (club.category || "").toLowerCase().includes(searchText) ||
        (club.createdBy?.name || "").toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        club.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [clubs, search, selectedCategory]);

  const getInitials = (name) => {
    return (name || "C")
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Technical: "⌘",
      Cultural: "✧",
      Sports: "⚡",
      Literary: "✎",
      Photography: "◎",
      Entrepreneurship: "↗",
      Other: "✦"
    };

    return icons[category] || "✦";
  };

  if (loading) {
    return (
      <div className="clubs-page">
        <div className="clubs-page-inner">
          <div className="clubs-loading-heading">
            <div className="clubs-skeleton clubs-skeleton-title"></div>
            <div className="clubs-skeleton clubs-skeleton-subtitle"></div>
          </div>

          <div className="clubs-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div className="club-card club-loading-card" key={item}>
                <div className="clubs-skeleton club-skeleton-image"></div>

                <div className="club-card-content">
                  <div className="clubs-skeleton clubs-skeleton-badge"></div>
                  <div className="clubs-skeleton clubs-skeleton-title"></div>
                  <div className="clubs-skeleton clubs-skeleton-line"></div>
                  <div className="clubs-skeleton clubs-skeleton-line short"></div>
                  <div className="clubs-skeleton clubs-skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="clubs-page">
        <div className="clubs-state-card">
          <div className="clubs-state-icon error-icon">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button
            type="button"
            className="clubs-retry-btn"
            onClick={fetchClubs}
          >
            Try Again ↻
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="clubs-page">
      <div className="clubs-decoration clubs-decoration-one"></div>
      <div className="clubs-decoration clubs-decoration-two"></div>

      <main className="clubs-page-inner">
        {/* Brand */}
        <div className="clubs-brand">
          <div className="clubs-brand-icon">✦</div>

          <span>
            Campus <strong>Connect</strong>
          </span>

          <span className="clubs-brand-divider"></span>
          <span className="clubs-brand-section">Communities</span>
        </div>

        {/* Hero */}
        <section className="clubs-hero">
          <div className="clubs-hero-content">
            <span className="clubs-eyebrow">
              <span className="clubs-eyebrow-dot"></span>
              FIND YOUR PEOPLE
            </span>

            <h1>
              Your interests.
              <br />
              Your <span>community.</span>
            </h1>

            <p>
              Discover communities that share your passions.
              Meet like-minded students, exchange ideas, and grow together.
            </p>

            <div className="clubs-hero-stats">
              <div className="clubs-stat">
                <span className="clubs-stat-number">{clubs.length}</span>
                <span className="clubs-stat-label">Communities</span>
              </div>

              <span className="clubs-stat-divider"></span>

              <div className="clubs-stat">
                <span className="clubs-stat-number">
                  {clubs.reduce(
                    (total, club) => total + (club.members?.length || 0),
                    0
                  )}
                </span>
                <span className="clubs-stat-label">Memberships</span>
              </div>
            </div>
          </div>

          <div className="clubs-hero-art" aria-hidden="true">
            <div className="clubs-art-orbit orbit-one"></div>
            <div className="clubs-art-orbit orbit-two"></div>

            <div className="clubs-art-center">
              <span>✦</span>
            </div>

            <div className="clubs-art-bubble bubble-one">⌘</div>
            <div className="clubs-art-bubble bubble-two">♡</div>
            <div className="clubs-art-bubble bubble-three">✧</div>
            <div className="clubs-art-bubble bubble-four">↗</div>

            <div className="clubs-art-caption">
              <span className="clubs-caption-dot"></span>
              Better together
            </div>
          </div>
        </section>

        {/* Discover Heading */}
        <section className="clubs-discover">
          <div className="clubs-section-heading">
            <div>
              <span className="clubs-section-kicker">EXPLORE & CONNECT</span>
              <h2>Discover your community</h2>
              <p>There's a place for everyone. Find yours.</p>
            </div>

            <Link to="/createClub" className="create-club-btn">
              <span className="create-club-plus">+</span>
              Create a Club
            </Link>
          </div>

          {/* Search */}
          <div className="clubs-toolbar">
            <div className="clubs-search">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m20 20-4-4"></path>
              </svg>

              <input
                type="search"
                placeholder="Search clubs, interests, or creators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search clubs"
              />

              {search && (
                <button
                  type="button"
                  className="clubs-clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <span className="clubs-results-count">
              {filteredClubs.length}{" "}
              {filteredClubs.length === 1 ? "club" : "clubs"} found
            </span>
          </div>

          {/* Category Filters */}
          <div className="clubs-category-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`clubs-filter-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category !== "All" && (
                  <span>{getCategoryIcon(category)}</span>
                )}

                {category === "All" ? "All Clubs" : category}
              </button>
            ))}
          </div>
        </section>

        {/* Clubs Grid */}
        <section className="clubs-grid-section">
          {filteredClubs.length === 0 ? (
            <div className="clubs-empty-state">
              <div className="clubs-empty-icon">
                {clubs.length === 0 ? "✦" : "⌕"}
              </div>

              <h3>
                {clubs.length === 0
                  ? "Your community starts here"
                  : "No clubs found"}
              </h3>

              <p>
                {clubs.length === 0
                  ? "Be the first to create a club and bring students together."
                  : "Try a different search term or category to discover more clubs."}
              </p>

              {clubs.length === 0 ? (
                <Link to="/createClub" className="create-club-btn">
                  + Create the First Club
                </Link>
              ) : (
                <button
                  type="button"
                  className="clubs-retry-btn"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="clubs-grid">
              {filteredClubs.map((club) => (
                <article className="club-card" key={club._id}>
                  <div className="club-card-banner">
                    {club.image ? (
                      <img
                        src={`http://localhost:8000${club.image}`}
                        alt={`${club.clubName} cover`}
                        className="club-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="club-placeholder">
                        <span className="club-placeholder-decoration">
                          ✧
                        </span>

                        <span className="club-placeholder-initial">
                          {getInitials(club.clubName)}
                        </span>

                        <span className="club-placeholder-bottom">
                          CAMPUS COMMUNITY
                        </span>
                      </div>
                    )}

                    <span className="club-category">
                      <span>{getCategoryIcon(club.category)}</span>
                      {club.category || "Community"}
                    </span>
                  </div>

                  <div className="club-card-content">
                    <h3 title={club.clubName}>{club.clubName}</h3>

                    <p className="club-description">
                      {club.description || "A community for students to connect and grow."}
                    </p>

                    <div className="club-card-meta">
                      <div className="club-owner">
                        <div className="club-owner-avatar">
                          {getInitials(club.createdBy?.name)}
                        </div>

                        <div className="club-owner-details">
                          <span className="club-meta-label">CREATED BY</span>
                          <span
                            className="club-owner-name"
                            title={club.createdBy?.name || "Unknown"}
                          >
                            {club.createdBy?.name || "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="club-member-count">
                        <span className="club-members-icon">♧</span>

                        <div>
                          <strong>{club.members?.length || 0}</strong>
                          <span>Members</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/club/${club._id}`}
                      className="view-club-btn"
                    >
                      <span>Explore Club</span>
                      <span className="view-club-arrow">↗</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        {clubs.length > 0 && (
          <section className="clubs-bottom-cta">
            <div className="clubs-cta-icon">✦</div>

            <div className="clubs-cta-text">
              <h3>Can't find your kind of community?</h3>
              <p>Start something new. Your people are waiting.</p>
            </div>

            <Link to="/createClub" className="clubs-cta-button">
              Start a Club <span>↗</span>
            </Link>
          </section>
        )}

        <footer className="clubs-footer">
          <span>Campus Connect</span>
          <span>Connect. Collaborate. Grow. ✦</span>
        </footer>
      </main>
    </div>
  );
}

export default AllClubs;