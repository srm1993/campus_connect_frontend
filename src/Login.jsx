
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ handleLogin }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:8000/api/loginUser",
                formData
            );

            if (res.data.status === "inactive") {
                setError(
                    "Your account is inactive. Please contact the administration."
                );
                return;
            }

            const { _id, name, role } = res.data;

            if (!_id || !role) {
                setError("Invalid login response. Please try again.");
                return;
            }

            // Validate role before updating authentication
            if (!["admin", "faculty", "student"].includes(role)) {
                setError("Your account role is not recognized.");
                return;
            }

            // Update authentication state and localStorage
            handleLogin({
                userid: _id,
                name: name,
                role: role
            });
            localStorage.setItem('user',JSON.stringify(res.data));
            // Redirect according to role
            if (role === "admin") {
                navigate("/admin");
            } else if (role === "faculty") {
                navigate("/faculty");
            } else {
                navigate("/student");
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to log in. Please check your credentials and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-decoration login-decoration-one"></div>
            <div className="login-decoration login-decoration-two"></div>
            <div className="login-decoration login-decoration-three"></div>

            <div className="login-container">

                {/* Left branding section */}
                <div className="login-welcome">

                    <div className="login-brand">
                        <div className="login-brand-logo">
                            <img
                                src="/logo/logo.png"
                                alt="Campus Connect Logo"
                            />
                        </div>

                        <span>
                            Campus<span className="login-brand-highlight">
                                Connect
                            </span>
                        </span>
                    </div>

                    <div className="login-welcome-content">

                        <span className="login-badge">
                            ✨ YOUR CAMPUS, CONNECTED
                        </span>

                        <h1>
                            Your campus life,
                            <br />
                            <span>all in one place.</span>
                        </h1>

                        <p>
                            Connect with students, discover exciting events,
                            collaborate with faculty, and make every campus
                            moment count.
                        </p>

                        <div className="login-feature-list">

                            <div className="login-feature">
                                <span className="login-feature-icon">✦</span>
                                <span>Discover campus events</span>
                            </div>

                            <div className="login-feature">
                                <span className="login-feature-icon">◎</span>
                                <span>Connect with your community</span>
                            </div>

                            <div className="login-feature">
                                <span className="login-feature-icon">↗</span>
                                <span>Learn, collaborate and grow</span>
                            </div>

                        </div>
                    </div>

                    <div className="login-welcome-footer">
                        <span className="login-footer-dot"></span>
                        One community. Endless possibilities.
                    </div>

                </div>

                {/* Right login form */}
                <div className="login-form-section">

                    <div className="login-card">

                        <div className="login-mobile-logo">

                            <div className="login-brand-logo">
                                <img
                                    src="/logo/logo.png"
                                    alt="Campus Connect Logo"
                                />
                            </div>

                            <span>
                                Campus<span className="login-brand-highlight">
                                    Connect
                                </span>
                            </span>

                        </div>

                        <div className="login-heading">

                            <div className="login-heading-icon">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>

                            <h2>Welcome back!</h2>

                            <p>
                                Sign in to continue your campus journey.
                            </p>

                        </div>

                        <form onSubmit={handleSubmit} className="login-form">

                            {error && (
                                <div className="login-error" role="alert">
                                    <span>!</span>
                                    {error}
                                </div>
                            )}

                            <div className="login-field">

                                <label htmlFor="login-email">
                                    Email Address
                                </label>

                                <div className="login-input-wrapper">

                                    <svg
                                        className="login-input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <rect x="3" y="5" width="18" height="14" rx="2" />
                                        <path d="m3 7 9 6 9-6" />
                                    </svg>

                                    <input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                    />

                                </div>
                            </div>

                            <div className="login-field">

                                <label htmlFor="login-password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <svg
                                        className="login-input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <rect x="3" y="11" width="18" height="10" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>

                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="login-password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                                <path d="M9.9 5.2A11 11 0 0 1 12 5c5 0 9 5 9 7a9.8 9.8 0 0 1-3 4" />
                                                <path d="M6.2 6.2C3.7 7.8 3 10.5 3 12c0 2 4 7 9 7 1.1 0 2.1-.2 3-.6" />
                                            </svg>
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>

                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={loading}
                            >
                                <span>
                                    {loading ? "Signing you in..." : "Sign In"}
                                </span>

                                {!loading && (
                                    <span className="login-submit-arrow">
                                        →
                                    </span>
                                )}
                            </button>

                        </form>

                        <div className="login-register">
                            <span>New to Campus Connect?</span>

                            <Link to="/register">
                                Create an account <span>↗</span>
                            </Link>
                        </div>

                        <div className="login-card-footer">
                            <span>✦</span>
                            Your campus community awaits.
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;
