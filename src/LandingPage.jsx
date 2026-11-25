
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LandingPage.css";

function LandingPage() {
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, clubRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/allEvent"),
                    axios.get("http://localhost:8000/club/allClubs")
                ]);

                setEvents(Array.isArray(eventRes.data.events) ? eventRes.data.events : []);
                setClubs(Array.isArray(clubRes.data.clubs) ? clubRes.data.clubs : []);
            } catch (error) {
                console.error("Error fetching landing page data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const upcomingEvents = events
        .filter(event => new Date(event.eventDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .slice(0, 3);

    const featuredClubs = clubs.slice(0, 3);

    const getEventImage = (image) => {
        if (!image) return null;
        if (image.startsWith("http")) return image;
        return `http://localhost:8000/${image.replace(/^\/+/, "")}`;
    };

    return (
        <div className="landing-page">

            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <span className="hero-tag">
                        WELCOME TO YOUR CAMPUS COMMUNITY
                    </span>

                    <h1>
                        Connect. Collaborate.
                        <span> Grow.</span>
                    </h1>

                    <p>
                        Discover campus events, join exciting clubs,
                        connect with students and faculty, and make
                        your college experience unforgettable.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/register" className="hero-btn primary-btn">
                            Get Started <span>→</span>
                        </Link>

                        <Link to="/login" className="hero-btn secondary-btn">
                            Explore Events
                        </Link>
                    </div>
                </div>
            </section>

            {/* STATISTICS */}
            <section className="stats-section">
                <div className="stat-box">
                    <div className="stat-icon">🎉</div>
                    <h2>{events.length}+</h2>
                    <p>Campus Events</p>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">🏛️</div>
                    <h2>{clubs.length}+</h2>
                    <p>Active Clubs</p>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">🤝</div>
                    <h2>Connect</h2>
                    <p>With Your Community</p>
                </div>

                <div className="stat-box">
                    <div className="stat-icon">🚀</div>
                    <h2>Grow</h2>
                    <p>Learn New Skills</p>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="about-section">
                <div className="about-image">
                    <img
                        src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900"
                        alt="Students collaborating on campus"
                    />
                </div>

                <div className="about-content">
                    <span className="section-tag">ABOUT CAMPUS CONNECT</span>
                    <h2>Your Campus. Your Community. Your Opportunities.</h2>

                    <p>
                        Campus Connect is a digital platform designed to
                        bring students and faculty members together.
                        Discover exciting events, participate in activities,
                        join clubs, and build meaningful connections.
                    </p>

                    <div className="about-points">
                        <p>✓ Discover and participate in campus events</p>
                        <p>✓ Join clubs based on your interests</p>
                        <p>✓ Connect and collaborate with others</p>
                        <p>✓ Share ideas and grow together</p>
                    </div>

                    <Link to="/register" className="about-btn">
                        Join Our Community →
                    </Link>
                </div>
            </section>

            {/* EVENTS SECTION */}
            <section className="events-section">
                <div className="section-heading">
                    <div>
                        <span className="section-tag">WHAT'S HAPPENING?</span>
                        <h2>Upcoming Campus Events</h2>
                        <p>Don't miss out on exciting campus activities.</p>
                    </div>

                    <Link to="/login" className="view-all-btn">
                        View All Events →
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-text">Loading events...</div>
                ) : upcomingEvents.length === 0 ? (
                    <div className="empty-state">
                        <span>📅</span>
                        <h3>No Upcoming Events</h3>
                        <p>Stay connected. New campus events will appear here.</p>
                    </div>
                ) : (
                    <div className="event-grid">
                        {upcomingEvents.map(event => (
                            <div className="event-card" key={event._id}>
                                <div className="event-image">
                                    {event.image ? (
                                        <img
                                            src={getEventImage(event.image)}
                                            alt={event.title}
                                        />
                                    ) : (
                                        <div className="event-placeholder">🎉</div>
                                    )}

                                    <span className="event-category">
                                        {event.category || "Campus Event"}
                                    </span>
                                </div>

                                <div className="event-info">
                                    <p className="event-date">
                                        📅 {new Date(event.eventDate).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </p>

                                    <h3>{event.title}</h3>

                                    <p className="event-description">
                                        {event.description}
                                    </p>

                                    <div className="event-meta">
                                        <span>📍 {event.venue}</span>
                                        <span>🕒 {event.startTime}</span>
                                    </div>

                                    <Link to="/login" className="event-link">
                                        Explore Event →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CLUBS SECTION */}
            <section className="clubs-section">
                <div className="section-heading">
                    <div>
                        <span className="section-tag">FIND YOUR COMMUNITY</span>
                        <h2>Explore Campus Clubs</h2>
                        <p>Discover your passion and connect with like-minded people.</p>
                    </div>

                    <Link to="/login" className="view-all-btn">
                        View All Clubs →
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-text">Loading clubs...</div>
                ) : featuredClubs.length === 0 ? (
                    <div className="empty-state">
                        <span>🏛️</span>
                        <h3>No Clubs Available</h3>
                        <p>Check back soon for exciting campus communities.</p>
                    </div>
                ) : (
                    <div className="club-grid">
                        {featuredClubs.map(club => (
                            <div className="club-card" key={club._id}>
                                <div className="club-icon">♧</div>

                                <span className="club-category">
                                    {club.category || "Campus Club"}
                                </span>

                                <h3>{club.clubName}</h3>

                                <p>{club.description}</p>

                                <Link to="/login" className="club-link">
                                    Explore Club →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* WHY CAMPUS CONNECT */}
            <section className="features-section">
                <div className="features-heading">
                    <span className="section-tag">WHY CAMPUS CONNECT?</span>
                    <h2>Everything Your Campus Needs</h2>
                    <p>One platform. Endless opportunities.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <span>📅</span>
                        <h3>Event Management</h3>
                        <p>Discover, register, and participate in exciting campus events.</p>
                    </div>

                    <div className="feature-card">
                        <span>👥</span>
                        <h3>Student Community</h3>
                        <p>Build friendships and collaborate with fellow students.</p>
                    </div>

                    <div className="feature-card">
                        <span>🏆</span>
                        <h3>Campus Clubs</h3>
                        <p>Join communities that match your interests and passion.</p>
                    </div>

                    <div className="feature-card">
                        <span>💬</span>
                        <h3>Club Communication</h3>
                        <p>Share ideas and communicate with your club members.</p>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="cta-section">
                <h2>Make Your Campus Life More Meaningful!</h2>
                <p>
                    Be part of an active campus community.
                    Discover opportunities and start connecting today.
                </p>

                <Link to="/register" className="cta-btn">
                    Join Campus Connect →
                </Link>
            </section>

            {/* FOOTER */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div>
                        <h2>Campus Connect</h2>
                        <p>Connect. Collaborate. Grow.</p>
                    </div>

                    <div className="footer-links">
                        <Link to="/">Home</Link>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    © {new Date().getFullYear()} Campus Connect. All Rights Reserved.
                </div>
            </footer>

        </div>
    );
}

export default LandingPage;
