
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./ViewClub.css";

const API_URL = "http://localhost:8000";

function ViewClub() {
  const { id } = useParams();

  const [club, setClub] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const currentUserId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  // Common request headers
  const getHeaders = () => ({
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  });

  // Fetch club details
  const fetchClub = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await axios.get(
        `${API_URL}/club/fetchClub/${id}`
      );

      setClub(response.data.club || null);
      setMessage("");
      setMessageType("");

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to load club details."
      );

      setMessageType("error");
      setClub(null);

    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClub(true);
  }, [fetchClub]);

  // Normalize members
  const members = Array.isArray(club?.members)
    ? club.members
    : [];

  // Get member ID
  const getMemberId = (member) => {
    if (member && typeof member === "object") {
      return member._id || member.id || "";
    }

    return member || "";
  };

  // Get owner ID
  const getOwnerId = () => {
    if (club?.createdBy && typeof club.createdBy === "object") {
      return club.createdBy._id || club.createdBy.id || "";
    }

    return club?.createdBy || "";
  };

  // Check owner
  const isOwner =
    Boolean(currentUserId) &&
    String(getOwnerId()) === String(currentUserId);

  // Check membership
  const isMember = Boolean(currentUserId) &&
    members.some(
      (member) =>
        String(getMemberId(member)) === String(currentUserId)
    );

  // Get initials
  const getInitial = (name) =>
    (name || "U").trim().charAt(0).toUpperCase();

  // Join club
  const joinClub = async (clubId) => {
    const studentId = localStorage.getItem("userid");

    if (!studentId) {
      alert("Please login to join this club.");
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");

      const response = await axios.post(
        `${API_URL}/club/joinClub/${studentId}/${clubId}`,
        {},
        {
          headers: getHeaders()
        }
      );

      setMessage(
        response.data.message || "You joined the club successfully."
      );
      setMessageType("success");

      await fetchClub();

    } catch (error) {
      console.error("Join Club Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to join club."
      );

      setMessageType("error");

    } finally {
      setActionLoading(false);
    }
  };

  // Leave club
  const leaveClub = async (clubId) => {
    const studentId = localStorage.getItem("userid");

    const confirmed = window.confirm(
      `Are you sure you want to leave ${club.clubName}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setMessage("");

      const response = await axios.post(
        `${API_URL}/club/leaveClub/${studentId}/${clubId}`,
        {},
        {
          headers: getHeaders()
        }
      );

      setMessage(
        response.data.message || "You left the club successfully."
      );

      setMessageType("success");

      await fetchClub();

    } catch (error) {
      console.error("Leave Club Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to leave this club."
      );

      setMessageType("error");

    } finally {
      setActionLoading(false);
    }
  };

  // Report club
  const reportClub = async (clubId) => {
    const reason = window.prompt(
      "Enter the reason for reporting this club:"
    );

    if (!reason || !reason.trim()) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to report this club?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");

      const response = await axios.post(
        `${API_URL}/club/reportClub`,
        {
          clubId: clubId,
          reason: reason.trim(),
          studentId: localStorage.getItem("userid")
        },
        {
          headers: getHeaders()
        }
      );

      setMessage(
        response.data.message || "Club reported successfully."
      );

      setMessageType("success");

    } catch (error) {
      console.error("Report Club Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to report club."
      );

      setMessageType("error");

    } finally {
      setActionLoading(false);
    }
  };

  // Delete club - Owner only
  const deleteClub = async (clubId) => {
    if (!isOwner) {
      alert("Only the club owner can delete this club.");
      return;
    }

    const reason = window.prompt(
      "Enter the reason for deleting this club:"
    );

    if (!reason || !reason.trim()) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this club? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");

      const response = await axios.delete(
        `${API_URL}/club/deleteClub/${clubId}`,
        {
          data: {
            reason: reason.trim(),
            deletedBy: localStorage.getItem("userid")
          },
          headers: getHeaders()
        }
      );

      setMessage(
        response.data.message || "Club deleted successfully."
      );

      setMessageType("success");
      setClub(null);

    } catch (error) {
      console.error("Delete Club Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to delete club."
      );

      setMessageType("error");

    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="view-club-page">
        <div className="view-club-loading">
          <div className="view-club-spinner"></div>
          <h3>Discovering your community...</h3>
          <p>Getting everything ready for you.</p>
        </div>
      </div>
    );
  }

  // Club not found or deleted
  if (!club) {
    return (
      <div className="view-club-page">
        <div className="view-club-error-card">

          <div className="view-club-error-icon">!</div>

          <h2>Club not found</h2>

          <p>
            {message ||
              "This club may have been removed or is unavailable."}
          </p>

          <Link to="/allClubs" className="view-club-back-btn">
            ← Back to All Clubs
          </Link>

        </div>
      </div>
    );
  }

  // Category icons
  const categoryIcons = {
    Technical: "⌘",
    Cultural: "✧",
    Sports: "⚡",
    Literary: "✎",
    Photography: "◎",
    Entrepreneurship: "↗",
    Other: "✦"
  };

  const categoryIcon = categoryIcons[club.category] || "✦";

  return (
    <div className="view-club-page">

      <main className="view-club-container">

        {/* Breadcrumb */}
        <div className="view-club-breadcrumb">

          <Link to="/allClubs">Communities</Link>

          <span>/</span>

          <span className="view-club-breadcrumb-current">
            {club.clubName}
          </span>

        </div>

        {/* Hero Banner */}
        <section className="view-club-hero">

          {club.image ? (
            <img
              className="view-club-cover-image"
              src={`${API_URL}${club.image}`}
              alt={`${club.clubName} cover`}
            />
          ) : (
            <div className="view-club-cover-placeholder">

              <span className="view-club-cover-decoration cover-decoration-one">
                ✧
              </span>

              <span className="view-club-cover-decoration cover-decoration-two">
                ✦
              </span>

              <span className="view-club-cover-initial">
                {getInitial(club.clubName)}
              </span>

            </div>
          )}

          <div className="view-club-cover-overlay"></div>

          <Link to="/allClubs" className="view-club-back-link">
            ← All Clubs
          </Link>

          <div className="view-club-hero-content">

            <span className="view-club-category-badge">
              <span>{categoryIcon}</span>
              {club.category || "Community"}
            </span>

            <h1>{club.clubName}</h1>

            <p>
              {club.description ||
                "A community where students connect and grow."}
            </p>

            <div className="view-club-hero-stats">

              <div className="view-club-hero-stat">

                <span className="view-club-stat-icon">♧</span>

                <div>
                  <strong>{members.length}</strong>
                  <span>
                    {members.length === 1 ? "Member" : "Members"}
                  </span>
                </div>

              </div>

              <span className="view-club-stat-divider"></span>

              <div className="view-club-hero-stat">

                <span className="view-club-stat-icon">✦</span>

                <div>
                  <strong>{club.category || "General"}</strong>
                  <span>Club category</span>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Notification */}
        {message && (
          <div
            className={`view-club-alert ${
              messageType === "success"
                ? "view-club-alert-success"
                : "view-club-alert-error"
            }`}
            role="status"
          >

            <span className="view-club-alert-icon">
              {messageType === "success" ? "✓" : "!"}
            </span>

            <span>{message}</span>

            <button
              type="button"
              onClick={() => {
                setMessage("");
                setMessageType("");
              }}
              aria-label="Dismiss message"
            >
              ×
            </button>

          </div>
        )}

        {/* Main Content */}
        <div className="view-club-layout">

          {/* Left Column */}
          <div className="view-club-main-column">

            {/* About */}
            <section className="view-club-panel">

              <div className="view-club-panel-heading">

                <div className="view-club-panel-icon">✦</div>

                <div>
                  <span className="view-club-panel-kicker">
                    GET TO KNOW US
                  </span>

                  <h2>About this club</h2>
                </div>

              </div>

              <p className="view-club-about-text">
                {club.description ||
                  "This club brings students together to share ideas, learn new skills, and build meaningful connections."}
              </p>

              <div className="view-club-about-divider"></div>

              <div className="view-club-info-grid">

                <div className="view-club-info-item">

                  <span className="view-club-info-icon">✧</span>

                  <div>
                    <span>Category</span>
                    <strong>{club.category || "General"}</strong>
                  </div>

                </div>

                <div className="view-club-info-item">

                  <span className="view-club-info-icon">♧</span>

                  <div>
                    <span>Community size</span>
                    <strong>
                      {members.length}{" "}
                      {members.length === 1 ? "member" : "members"}
                    </strong>
                  </div>

                </div>

              </div>
            </section>

            {/* Club Rules */}
            <section className="view-club-panel">

              <div className="view-club-panel-heading">

                <div className="view-club-panel-icon rules-icon">☷</div>

                <div>
                  <span className="view-club-panel-kicker">
                    COMMUNITY GUIDELINES
                  </span>

                  <h2>Club rules</h2>
                </div>

              </div>

              {club.rules?.trim() ? (

                <div className="view-club-rules-content">

                  {club.rules
                    .split(/\r?\n/)
                    .filter((rule) => rule.trim())
                    .map((rule, index) => (
                      <div className="view-club-rule" key={index}>

                        <span className="view-club-rule-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p>{rule}</p>

                      </div>
                    ))}

                </div>

              ) : (

                <div className="view-club-no-rules">
                  <span>✧</span>
                  <p>
                    No specific rules have been added to this club yet.
                  </p>
                </div>

              )}

            </section>

            {/* Member Directory */}
            <section className="view-club-panel">

              <div className="view-club-panel-heading view-club-members-heading">

                <div className="view-club-panel-icon members-icon">♧</div>

                <div>
                  <span className="view-club-panel-kicker">
                    MEET THE COMMUNITY
                  </span>

                  <h2>Club members</h2>
                </div>

                <span className="view-club-member-total">
                  {members.length}
                </span>

              </div>

              {members.length > 0 ? (

                <div className="view-club-member-list">

                  {members.map((member, index) => {

                    const memberId = getMemberId(member);

                    const memberName =
                      typeof member === "object"
                        ? member.name || "Campus Member"
                        : "Campus Member";

                    const memberIsOwner =
                      String(memberId) === String(getOwnerId());

                    return (
                      <div
                        className="view-club-member-item"
                        key={memberId || index}
                      >

                        <div
                          className={`view-club-member-avatar avatar-color-${index % 5}`}
                        >
                          {getInitial(memberName)}
                        </div>

                        <div className="view-club-member-details">

                          <strong>{memberName}</strong>

                          <span>
                            {memberIsOwner
                              ? "Club founder"
                              : "Community member"}
                          </span>

                        </div>

                        {memberIsOwner && (
                          <span className="view-club-owner-badge">
                            OWNER
                          </span>
                        )}

                      </div>
                    );
                  })}

                </div>

              ) : (

                <div className="view-club-no-rules">
                  <span>♧</span>
                  <p>
                    No members to display yet. Be the first to join!
                  </p>
                </div>

              )}

            </section>

          </div>

          {/* Right Sidebar */}
          <aside className="view-club-sidebar">

            {/* Membership Card */}
            <section className="view-club-join-card">

              <div className="view-club-join-card-decoration"></div>

              <div className="view-club-join-symbol">✦</div>

              <span className="view-club-join-kicker">
                YOUR COMMUNITY AWAITS
              </span>

              <h2>
                {isOwner
                  ? "Your club, your community."
                  : isMember
                    ? "You're part of the community!"
                    : "Find your people."}
              </h2>

              <p>
                {isOwner
                  ? "You created this space. Keep building a welcoming community for students."
                  : isMember
                    ? "Connect with fellow members, share ideas, and make the most of your community."
                    : "Join this club to connect with like-minded students and explore shared interests."}
              </p>

              {/* OWNER: DELETE ONLY */}
              {isOwner ? (

                <button
                  type="button"
                  className="view-club-delete-btn"
                  onClick={() => deleteClub(club._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    "Deleting..."
                  ) : (
                    <>
                      Delete Club <span>🗑</span>
                    </>
                  )}
                </button>

              ) : isMember ? (

                /* MEMBER: REPORT + LEAVE */
                <div className="view-club-member-actions">

                  <button
                    type="button"
                    className="view-club-report-btn"
                    onClick={() => reportClub(club._id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : (
                      <>
                        Report Club <span>⚑</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="view-club-leave-btn"
                    onClick={() => leaveClub(club._id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : (
                      <>
                        Leave Club <span>↗</span>
                      </>
                    )}
                  </button>

                </div>

              ) : (

                /* NOT MEMBER: JOIN ONLY */
                <button
                  type="button"
                  className="view-club-join-btn"
                  onClick={() => joinClub(club._id)}
                  disabled={actionLoading || !currentUserId}
                >
                  {actionLoading ? (
                    <>
                      <span className="view-club-button-spinner"></span>
                      Joining...
                    </>
                  ) : (
                    <>
                      Join This Club <span>→</span>
                    </>
                  )}
                </button>

              )}

              <div className="view-club-join-footer">
                <span>✧</span>
                Connect. Collaborate. Grow.
              </div>

            </section>

            {/* Owner Information */}
            <section className="view-club-owner-card">

              <span className="view-club-sidebar-kicker">
                THE PERSON BEHIND IT
              </span>

              <h3>Club founder</h3>

              <div className="view-club-founder">

                <div className="view-club-founder-avatar">
                  {getInitial(club.createdBy?.name)}
                </div>

                <div className="view-club-founder-details">

                  <strong>
                    {club.createdBy?.name || "Unknown"}
                  </strong>

                  <span>Club creator</span>

                </div>

                <span className="view-club-founder-star">✦</span>

              </div>

            </section>

            {/* Community Information */}
            <section className="view-club-community-card">

              <div className="view-club-community-icon">♡</div>

              <h3>Great communities start with you.</h3>

              <p>
                Share knowledge, respect others, and help make campus life
                more connected.
              </p>

              <Link to="/allClubs">
                Explore other clubs <span>→</span>
              </Link>

            </section>

          </aside>
        </div>

        {/* Footer */}
        <footer className="view-club-footer">

          <Link to="/allClubs">
            ← Back to all clubs
          </Link>

          <span>
            Campus Connect
            <span className="view-club-footer-star">✦</span>
            &nbsp; Connect. Collaborate. Grow.
          </span>

        </footer>

      </main>
    </div>
  );
}

export default ViewClub;
