
import { Link } from "react-router-dom";
import "./FacultyLanding.css";

function FacultyLanding() {
    const facultyName = localStorage.getItem("name") || "Faculty Member";

    const managementCards = [
        {
            icon: "📅",
            title: "Manage Events",
            description:
                "View campus events, manage activities, and keep students informed about upcoming programs.",
            link: "/allEvents",
            color: "blue",
        },
        {
            icon: "👥",
            title: "Campus Clubs",
            description:
                "Explore student clubs, discover communities, and keep track of club activities.",
            link: "/allClubss",
            color: "purple",
        },
        {
            icon: "✨",
            title: "Create Event",
            description:
                "Organize workshops, seminars, competitions, and other campus activities.",
            link: "/CreateEvents",
            color: "green",
        },
    ];

    const quickActions = [
        {
            icon: "✨",
            title: "Create Event",
            description: "Plan and announce a new campus event.",
            link: "/CreateEvents",
        },
        {
            icon: "📋",
            title: "All Events",
            description: "View and manage campus events.",
            link: "/allEvents",
        },
        {
            icon: "💬",
            title: "Student Clubs",
            description: "Explore clubs and student communities.",
            link: "/allClubss",
        },
    ];

    return (
        <div className="faculty-dashboard">

            {/* Welcome Banner */}
            <section className="faculty-welcome">

                <div className="faculty-welcome-content">

                    <span className="faculty-welcome-label">
                        CAMPUS CONNECT · FACULTY PORTAL
                    </span>

                    <h1>
                        Welcome back, {facultyName}! <span>👋</span>
                    </h1>

                    <p>
                        Inspire students, organize engaging campus events,
                        and help build a stronger college community.
                    </p>

                    <Link
                        to="/allEvents"
                        className="faculty-welcome-btn"
                    >
                        Explore Campus Events <span>→</span>
                    </Link>

                </div>

                <div className="faculty-welcome-art" aria-hidden="true">

                    <div className="faculty-art-circle">
                        <span>👨‍🏫</span>
                    </div>

                    <span className="faculty-floating-icon faculty-float-one">
                        📚
                    </span>

                    <span className="faculty-floating-icon faculty-float-two">
                        🎓
                    </span>

                    <span className="faculty-floating-icon faculty-float-three">
                        ✨
                    </span>

                </div>

            </section>

            {/* Management Section */}
            <section className="faculty-section">

                <div className="faculty-section-heading">

                    <div>
                        <span className="faculty-section-label">
                            YOUR WORKSPACE
                        </span>

                        <h2>Faculty Dashboard</h2>

                        <p>
                            Everything you need to support campus life in one place.
                        </p>
                    </div>

                    <span className="faculty-role-badge">
                        FACULTY
                    </span>

                </div>

                <div className="faculty-management-grid">

                    {managementCards.map((card) => (
                        <Link
                            to={card.link}
                            className="faculty-management-card"
                            key={card.title}
                        >

                            <div
                                className={`faculty-management-icon ${card.color}`}
                            >
                                {card.icon}
                            </div>

                            <h3>{card.title}</h3>

                            <p>{card.description}</p>

                            <div className="faculty-card-link">
                                Explore Section <span>↗</span>
                            </div>

                        </Link>
                    ))}

                </div>

            </section>

            {/* Quick Actions */}
            <section className="faculty-section faculty-quick-section">

                <div className="faculty-section-heading">

                    <div>
                        <h2>Quick Actions</h2>

                        <p>
                            Jump directly to your frequently used sections.
                        </p>
                    </div>

                </div>

                <div className="faculty-quick-grid">

                    {quickActions.map((action) => (
                        <Link
                            to={action.link}
                            className="faculty-quick-card"
                            key={action.title}
                        >

                            <div className="faculty-quick-icon">
                                {action.icon}
                            </div>

                            <div className="faculty-quick-text">
                                <h3>{action.title}</h3>

                                <p>{action.description}</p>
                            </div>

                            <span className="faculty-quick-arrow">
                                →
                            </span>

                        </Link>
                    ))}

                </div>

            </section>

            {/* Information Banner */}
            <section className="faculty-info-banner">

                <div className="faculty-info-icon">
                    🌟
                </div>

                <div className="faculty-info-content">

                    <h3>Make Campus Life More Engaging</h3>

                    <p>
                        Encourage student participation, coordinate meaningful
                        activities, and help every student feel connected.
                    </p>

                </div>

                <span className="faculty-info-tag">
                    <span className="faculty-online-dot"></span>
                    Faculty Portal
                </span>

            </section>

            {/* Footer */}
            <footer className="faculty-dashboard-footer">
                <span>✦</span> Connecting faculty, students, and campus life.
            </footer>

        </div>
    );
}

export default FacultyLanding;
