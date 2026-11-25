
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Header.css";

function NavLink({ to, icon, children }) {
    return (
        <Link to={to} className="cc-nav-link">
            <span className="cc-nav-icon">{icon}</span>
            <span>{children}</span>
        </Link>
    );
}

function Header({ auth, handleLogout }) {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const { IsLoggedIn, role, name } = auth;

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const logout = () => {
        handleLogout();
        closeMenu();
        navigate("/");
    };

    const getDashboard = () => {
        if (role === "admin") return "/adminProfile";
        if (role === "faculty") return "/facultyProfile";
        if (role === "student") return "/studentProfile";

        return "/";
    };

    return (
        <header className="cc-header">

            <div className="cc-header-container">

                {/* BRAND */}
                <Link
                    to={IsLoggedIn ? getDashboard() : "/"}
                    className="cc-brand"
                    onClick={closeMenu}
                >
                    <div className="cc-logo-wrapper">
                        <img
                            src="/logo/logo.png"
                            alt="Campus Connect Logo"
                            className="cc-logo"
                        />
                    </div>

                    <div className="cc-brand-text">
                        <h2>
                            Campus<span>Connect</span>
                        </h2>

                        <p>Connect. Collaborate. Grow.</p>
                    </div>
                </Link>

                {/* MOBILE MENU BUTTON */}
                <button
                    className={`cc-menu-toggle ${menuOpen ? "active" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    aria-controls="cc-navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* NAVIGATION */}
                <nav
                    id="cc-navigation"
                    className={`cc-navigation ${
                        menuOpen ? "cc-navigation-open" : ""
                    }`}
                    onClick={closeMenu}
                >

                    {IsLoggedIn ? (
                        <>

                            {/* ADMIN NAVIGATION */}
                            {role === "admin" && (
                                <>
                                    <NavLink to="/admin" icon="⌂">
                                        Dashboard
                                    </NavLink>

                                    <NavLink to="/allStudent" icon="♙">
                                        Students
                                    </NavLink>

                                    <NavLink to="/allFaculty" icon="♟">
                                        Faculty
                                    </NavLink>

                                    <NavLink to="/CreateEvent" icon="✦">
                                        Create Event
                                    </NavLink>

                                    <NavLink to="/allEvent" icon="▦">
                                        All Events
                                    </NavLink>

                                    <NavLink to="/allClubs" icon="♧">
                                        All Clubs
                                    </NavLink>

                                    <NavLink to="/allPost" icon="♧">
                                        All Post
                                    </NavLink>
                                </>
                            )}

                            {/* FACULTY NAVIGATION */}
                            {role === "faculty" && (
                                <>
                                    <NavLink to="/faculty" icon="⌂">
                                        Dashboard
                                    </NavLink>

                                    <NavLink to="/CreateEvents" icon="✦">
                                        Create Event
                                    </NavLink>

                                    <NavLink to="/allEvents" icon="▦">
                                        All Events
                                    </NavLink>

                                    <NavLink to="/allClubss" icon="♧">
                                        All Clubs
                                    </NavLink>

                                    <NavLink to="/allPost" icon="♧">
                                        All Post
                                    </NavLink>
                                </>
                            )}

                            {/* STUDENT NAVIGATION */}
                            {role === "student" && (
                                <>
                                    <NavLink to="/student" icon="⌂">
                                        Dashboard
                                    </NavLink>

                                    <NavLink to="/allEventss" icon="✦">
                                        All Events
                                    </NavLink>

                                    <NavLink to="/allClub" icon="♧">
                                        All Clubs
                                    </NavLink>

                                    <NavLink to="/createClub" icon="+">
                                        Create Club
                                    </NavLink>

                                    <NavLink to="/student/club-chat" icon="💬"> 
                                        Club Chat 
                                    </NavLink>

                                    <NavLink to="/allPost" icon="♧">
                                        All Post
                                    </NavLink>
                                </>
                            )}

                        </>
                    ) : (
                        <>
                            <Link
                                to="/"
                                className="cc-nav-link"
                                onClick={closeMenu}
                            >
                                <span className="cc-nav-icon">⌂</span>
                                Home
                            </Link>

                            <Link
                                to="/register"
                                className="cc-register-btn"
                                onClick={closeMenu}
                            >
                                <span>Get Started</span>
                                <span className="cc-register-arrow">↗</span>
                            </Link>
                        </>
                    )}

                    {/* MOBILE PROFILE */}
                    {IsLoggedIn && (
                        <div className="cc-mobile-profile">

                            <div className="cc-user-avatar">
                                {name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div className="cc-user-info">
                                <span className="cc-user-name">
                                    {name || "User"}
                                </span>

                                <span className="cc-user-role">
                                    {role}
                                </span>
                            </div>

                            <button
                                className="cc-logout-btn"
                                onClick={logout}
                            >
                                ↪ Logout
                            </button>

                        </div>
                    )}

                </nav>

                {/* DESKTOP USER PROFILE */}
                {IsLoggedIn && (
                    <div className="cc-user-section">

                        <Link
                            to={getDashboard()}
                            className="cc-profile-link"
                            title="Open dashboard"
                        >
                            <div className="cc-user-avatar">
                                {name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div className="cc-user-info">

                                <span className="cc-user-name">
                                    {name || "User"}
                                </span>

                                <span className="cc-user-role">
                                    <span className="cc-online-dot"></span>
                                    {role}
                                </span>

                            </div>
                        </Link>

                        <div className="cc-profile-divider"></div>

                        <button
                            className="cc-logout-btn"
                            onClick={logout}
                            title="Logout"
                        >
                            <span className="cc-logout-icon">↗</span>
                            <span>Logout</span>
                        </button>

                    </div>
                )}

            </div>

            {/* DECORATIVE BOTTOM BORDER */}
            <div className="cc-header-glow"></div>

        </header>
    );
}

export default Header;
