
import { Link } from "react-router-dom";
import "./StudentLanding.css";

function StudentLanding() {
    const studentName = localStorage.getItem("name") || "Student";

    const dashboardCards = [
        {
            title: "Campus Events",
            description: "Explore upcoming events, workshops and activities.",
            icon: "📅",
            link: "/allEventss",
            button: "Explore Events",
            className: "student-card-blue"
        },
        {
            title: "Student Clubs",
            description: "Discover clubs and connect with fellow students.",
            icon: "👥",
            link: "/allClub",
            button: "Explore Clubs",
            className: "student-card-purple"
        },
        {
            title: "Create a Club",
            description: "Have an idea? Start your own campus community.",
            icon: "🚀",
            link: "/createClub",
            button: "Create Club",
            className: "student-card-orange"
        }
    ];

    const quickLinks = [
        {
            title: "All Events",
            icon: "🎯",
            link: "/allEvent"
        },
        {
            title: "All Clubs",
            icon: "🤝",
            link: "/allClub"
        },
        {
            title: "Create Club",
            icon: "✨",
            link: "/createClub"
        }
    ];

    return (
        <div className="student-dashboard">

            {/* Welcome Section */}
            <section className="student-welcome">
                <div className="student-welcome-content">
                    <span className="student-welcome-badge">
                        STUDENT DASHBOARD
                    </span>

                    <h1>
                        Welcome back, {studentName}! 👋
                    </h1>

                    <p>
                        Your campus journey starts here. Discover events,
                        join communities, make connections and create
                        unforgettable experiences.
                    </p>

                    <div className="student-welcome-actions">
                        <Link to="/allEvent" className="student-primary-btn">
                            Explore Events <span>→</span>
                        </Link>

                        <Link to="/allClub" className="student-secondary-btn">
                            Discover Clubs
                        </Link>
                    </div>
                </div>

                <div className="student-welcome-illustration">
                    <div className="student-illustration-circle">
                        🎓
                    </div>
                    <div className="student-illustration-decoration decoration-one">
                        ✨
                    </div>
                    <div className="student-illustration-decoration decoration-two">
                        📚
                    </div>
                    <div className="student-illustration-decoration decoration-three">
                        🚀
                    </div>
                </div>
            </section>

            {/* Dashboard Heading */}
            <section className="student-section-heading">
                <div>
                    <h2>Your Campus Activities</h2>
                    <p>Everything you need to stay connected.</p>
                </div>
            </section>

            {/* Dashboard Cards */}
            <section className="student-dashboard-grid">
                {dashboardCards.map((card, index) => (
                    <div
                        className={`student-dashboard-card ${card.className}`}
                        key={index}
                    >
                        <div className="student-card-icon">
                            {card.icon}
                        </div>

                        <h3>{card.title}</h3>

                        <p>{card.description}</p>

                        <Link to={card.link} className="student-card-link">
                            {card.button}
                            <span>→</span>
                        </Link>
                    </div>
                ))}
            </section>

            {/* Quick Links */}
            <section className="student-quick-section">
                <div className="student-section-heading">
                    <div>
                        <h2>Quick Access</h2>
                        <p>Navigate to your favourite campus sections.</p>
                    </div>
                </div>

                <div className="student-quick-grid">
                    {quickLinks.map((item, index) => (
                        <Link
                            to={item.link}
                            className="student-quick-link"
                            key={index}
                        >
                            <span className="student-quick-icon">
                                {item.icon}
                            </span>

                            <span>{item.title}</span>

                            <span className="student-quick-arrow">↗</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Bottom Banner */}
            <section className="student-bottom-banner">
                <div>
                    <span className="student-bottom-label">
                        CAMPUS CONNECT
                    </span>

                    <h2>Connect. Collaborate. Grow.</h2>

                    <p>
                        Be active, participate in campus activities and
                        make the most of your student life.
                    </p>
                </div>

                <div className="student-bottom-icon">
                    🌟
                </div>
            </section>

        </div>
    );
}

export default StudentLanding;
