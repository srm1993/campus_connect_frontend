
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./FacultyAllClubs.css";

const API_URL = "http://localhost:8000";

function FacultyAllClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchClubs();
  }, []);

  // Fetch all clubs
  async function fetchClubs() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/club/fetchClubs`
      );

      setClubs(
        Array.isArray(response.data.clubs)
          ? response.data.clubs
          : []
      );
    } catch (err) {
      console.error("Fetch clubs error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load clubs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Delete club - Admin only
  const handleDeleteClub = async (clubId, clubName) => {
    if (role !== "admin") return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${clubName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(clubId);

      await axios.delete(
        `${API_URL}/club/deleteClub/${clubId}`
      );

      setClubs((previousClubs) =>
        previousClubs.filter((club) => club._id !== clubId)
      );

      window.alert("Club deleted successfully!");
    } catch (err) {
      console.error("Delete club error:", err);

      window.alert(
        err.response?.data?.message ||
        "Unable to delete club. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Category list
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        clubs.map((club) => club.category).filter(Boolean)
      )
    ];
  }, [clubs]);

  // Search and category filtering
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

  // Total memberships
  const totalMemberships = useMemo(() => {
    return clubs.reduce(
      (total, club) => total + (club.members?.length || 0),
      0
    );
  }, [clubs]);

  // Total reports across all clubs
  const totalReports = useMemo(() => {
    return clubs.reduce(
      (total, club) => total + (Number(club.totalReports) || 0),
      0
    );
  }, [clubs]);

  // Clubs requiring moderation
  const flaggedClubs = useMemo(() => {
    return clubs.filter(
      (club) => (Number(club.totalReports) || 0) >= 5
    ).length;
  }, [clubs]);

  // Initials
  const getInitials = (name) => {
    return (name || "C")
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  // Category icons
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

  // Report styling: increases gradually from 0 to 5
  const getReportStyle = (reportCount) => {
    const count = Math.min(
      Math.max(Number(reportCount) || 0, 0),
      5
    );

    if (count >= 5) {
      return {
        backgroundColor: "#fee2e2",
        border: "2px solid #dc2626",
        "--report-opacity": 1
      };
    }

    return {
      backgroundColor: `rgba(239, 68, 68, ${count * 0.055})`,
      border: `1px solid rgba(220, 38, 38, ${count * 0.12})`,
      "--report-opacity": count / 5
    };
  };

  // Loading UI
  if (loading) {
    return (
      <div className="clubs-page">
        <main className="clubs-page-inner">
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
        </main>
      </div>
    );
  }

  // Error UI
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

        {/* BRAND */}
        <div className="clubs-brand">
          <div className="clubs-brand-icon">✦</div>

          <span>
            Campus <strong>Connect</strong>
          </span>

          <span className="clubs-brand-divider"></span>

          <span className="clubs-brand-section">
            {role === "admin" ? "Club Management" : "Communities"}
          </span>
        </div>

        {/* HERO */}
        <section className="clubs-hero">
          <div className="clubs-hero-content">
            <span className="clubs-eyebrow">
              <span className="clubs-eyebrow-dot"></span>
              {role === "admin"
                ? "ADMINISTRATION PANEL"
                : "FIND YOUR PEOPLE"}
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
                <span className="clubs-stat-number">
                  {clubs.length}
                </span>
                <span className="clubs-stat-label">
                  Communities
                </span>
              </div>

              <span className="clubs-stat-divider"></span>

              <div className="clubs-stat">
                <span className="clubs-stat-number">
                  {totalMemberships}
                </span>
                <span className="clubs-stat-label">
                  Memberships
                </span>
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

        {/* ADMIN REPORT SUMMARY */}
        {role === "admin" && (
          <section className="admin-club-summary">
            <div className="admin-summary-card">
              <div className="admin-summary-icon">♧</div>
              <div>
                <span>Total Communities</span>
                <strong>{clubs.length}</strong>
              </div>
            </div>

            <div className="admin-summary-card">
              <div className="admin-summary-icon">⚑</div>
              <div>
                <span>Total Reports</span>
                <strong>{totalReports}</strong>
              </div>
            </div>

            <div className="admin-summary-card admin-summary-danger">
              <div className="admin-summary-icon">⚠</div>
              <div>
                <span>Flagged Clubs</span>
                <strong>{flaggedClubs}</strong>
              </div>
            </div>
          </section>
        )}

        {/* DISCOVER */}
        <section className="clubs-discover">
          <div className="clubs-section-heading">
            <div>
              <span className="clubs-section-kicker">
                EXPLORE & CONNECT
              </span>

              <h2>Discover your community</h2>

              <p>
                There's a place for everyone. Find yours.
              </p>
            </div>

            {role !== "admin" && (
              <Link to="/createClub" className="create-club-btn">
                <span className="create-club-plus">+</span>
                Create a Club
              </Link>
            )}
          </div>

          {/* SEARCH */}
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

          {/* CATEGORY FILTERS */}
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

        {/* CLUB GRID */}
        <section className="clubs-grid-section">

          {filteredClubs.length === 0 ? (
            <div className="clubs-empty-state">
              <div className="clubs-empty-icon">
                {clubs.length === 0 ? "✦" : "⌕"}
              </div>

              <h3>
                {clubs.length === 0
                  ? "No communities yet"
                  : "No clubs found"}
              </h3>

              <p>
                {clubs.length === 0
                  ? "There are currently no active clubs."
                  : "Try a different search term or category."}
              </p>

              {clubs.length === 0 && role !== "admin" && (
                <Link to="/createClub" className="create-club-btn">
                  + Create the First Club
                </Link>
              )}

              {clubs.length > 0 && (
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
              {filteredClubs.map((club) => {
                const reportCount =
                  Number(club.totalReports) || 0;

                const isFlagged = reportCount >= 5;

                return (
                  <article
                    className={`club-card ${
                      isFlagged ? "club-high-reports" : ""
                    }`}
                    key={club._id}
                    style={getReportStyle(reportCount)}
                  >
                    {/* IMAGE */}
                    <div className="club-card-banner">
                      {club.image ? (
                        <img
                          src={`${API_URL}${club.image}`}
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
                        <span>
                          {getCategoryIcon(club.category)}
                        </span>
                        {club.category || "Community"}
                      </span>

                      {isFlagged && (
                        <span className="club-flagged-badge">
                          ⚠ HIGHLY REPORTED
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="club-card-content">

                      <h3 title={club.clubName}>
                        {club.clubName}
                      </h3>

                      <p className="club-description">
                        {club.description ||
                          "A community for students to connect and grow."}
                      </p>

                      {/* REPORT PROGRESS */}
                      <div className="club-report-info">
                        <div className="club-report-heading">
                          <span>
                            <span className="club-report-icon">⚑</span>
                            Community Reports
                          </span>

                          <strong>
                            {reportCount} / 5
                          </strong>
                        </div>

                        <div className="club-report-progress">
                          <div
                            className="club-report-progress-fill"
                            style={{
                              width: `${Math.min(
                                reportCount * 20,
                                100
                              )}%`
                            }}
                          ></div>
                        </div>

                        <div className="club-report-footer">
                          <span>
                            {reportCount === 0
                              ? "No reports"
                              : reportCount < 5
                              ? `${5 - reportCount} more reports to moderation threshold`
                              : "Moderation threshold reached"}
                          </span>

                          {isFlagged && (
                            <span className="club-report-warning">
                              Needs attention
                            </span>
                          )}
                        </div>
                      </div>

                      {/* OWNER AND MEMBERS */}
                      <div className="club-card-meta">
                        <div className="club-owner">
                          <div className="club-owner-avatar">
                            {getInitials(club.createdBy?.name)}
                          </div>

                          <div className="club-owner-details">
                            <span className="club-meta-label">
                              CREATED BY
                            </span>

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
                            <strong>
                              {club.members?.length || 0}
                            </strong>
                            <span>Members</span>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="club-card-actions">
                        {/* <Link
                          to={`/club/${club._id}`}
                          className="view-club-btn"
                        >
                          <span>Explore Club</span>
                          <span className="view-club-arrow">↗</span>
                        </Link> */}

                        {/* ADMIN DELETE - ONLY AT 5+ REPORTS */}
                        {role === "admin" && isFlagged && (
                          <button
                            type="button"
                            className="delete-club-btn"
                            disabled={deletingId === club._id}
                            onClick={() =>
                              handleDeleteClub(
                                club._id,
                                club.clubName
                              )
                            }
                          >
                            {deletingId === club._id ? (
                              "Deleting..."
                            ) : (
                              <>
                                <span>🗑</span>
                                Delete Club
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* BOTTOM CTA */}
        {clubs.length > 0 && role !== "admin" && (
          <section className="clubs-bottom-cta">
            <div className="clubs-cta-icon">✦</div>

            <div className="clubs-cta-text">
              <h3>Can't find your kind of community?</h3>
              <p>
                Start something new. Your people are waiting.
              </p>
            </div>

            <Link to="/createClub" className="clubs-cta-button">
              Start a Club <span>↗</span>
            </Link>
          </section>
        )}

        {/* FOOTER */}
        <footer className="clubs-footer">
          <span>Campus Connect</span>
          <span>Connect. Collaborate. Grow. ✦</span>
        </footer>

      </main>
    </div>
  );
}

export default FacultyAllClubs;
