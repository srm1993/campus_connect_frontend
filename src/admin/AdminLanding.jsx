
import "./AdminLanding.css";

function AdminLanding() {
    const adminName = localStorage.getItem("name") || "Administrator";

    const dashboardCards = [
        {
            icon: "🎓",
            title: "Manage Students",
            description: "View student profiles and manage their account status.",
            link: "/allUser",
            color: "blue",
        },
        {
            icon: "👨‍🏫",
            title: "Manage Faculty",
            description: "View faculty members and manage their accounts.",
            link: "/allFaculty",
            color: "purple",
        },
        {
            icon: "📅",
            title: "Manage Events",
            description: "Create, review, and manage campus events.",
            link: "/allEvent",
            color: "orange",
        },
        {
            icon: "👥",
            title: "Manage Clubs",
            description: "Monitor student clubs and manage club activities.",
            link: "/allClub",
            color: "green",
        },
    ];

    const quickActions = [
        {
            icon: "➕",
            title: "Create Event",
            description: "Organize a new campus event.",
            link: "/createEvent",
        },
        {
            icon: "📋",
            title: "View All Events",
            description: "Review upcoming campus activities.",
            link: "/allEvent",
        },
        {
            icon: "🎓",
            title: "View Students",
            description: "Check student accounts and status.",
            link: "/allUser",
        },
    ];

    return (
        <div className="admin-dashboard">
            {/* Welcome Banner */}
            <section className="admin-welcome">
                <div className="welcome-content">
                    <span className="welcome-label">
                        CAMPUS CONNECT • ADMIN PANEL
                    </span>

                    <h1>
                        Welcome back, {adminName}! 👋
                    </h1>

                    <p>
                        Manage your campus community, events, students,
                        faculty, and clubs from one place.
                    </p>

                    <a href="/admin/allEvent" className="welcome-btn">
                        Explore Events <span>→</span>
                    </a>
                </div>

                <div className="welcome-illustration">
                    <div className="illustration-circle">
                        <span>🏛️</span>
                    </div>
                    <span className="floating-icon floating-one">🎓</span>
                    <span className="floating-icon floating-two">📅</span>
                    <span className="floating-icon floating-three">👥</span>
                </div>
            </section>

            {/* Overview */}
            <section className="admin-section">
                <div className="admin-section-heading">
                    <div>
                        <h2>Dashboard Overview</h2>
                        <p>Quick access to your campus management tools.</p>
                    </div>
                    <span className="overview-badge">ADMIN</span>
                </div>

                <div className="admin-management-grid">
                    {dashboardCards.map((card) => (
                        <a
                            href={card.link}
                            className="management-card"
                            key={card.title}
                        >
                            <div className={`management-icon ${card.color}`}>
                                {card.icon}
                            </div>

                            <h3>{card.title}</h3>
                            <p>{card.description}</p>

                            <div className="management-link">
                                Open Management <span>↗</span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="admin-section quick-actions-section">
                <div className="admin-section-heading">
                    <div>
                        <h2>Quick Actions</h2>
                        <p>Get things done with just one click.</p>
                    </div>
                </div>

                <div className="quick-actions-grid">
                    {quickActions.map((action) => (
                        <a
                            href={action.link}
                            className="quick-action-card"
                            key={action.title}
                        >
                            <div className="quick-action-icon">
                                {action.icon}
                            </div>

                            <div className="quick-action-text">
                                <h3>{action.title}</h3>
                                <p>{action.description}</p>
                            </div>

                            <span className="quick-action-arrow">→</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* Admin Information */}
            <section className="admin-footer-card">
                <div className="footer-card-icon">🛡️</div>

                <div>
                    <h3>Campus Community Management</h3>
                    <p>
                        Keep your campus connected by managing accounts,
                        coordinating events, and monitoring student clubs.
                    </p>
                </div>

                <span className="footer-status">
                    <span className="status-dot"></span>
                    Admin Portal
                </span>
            </section>
        </div>
    );
}

export default AdminLanding;
