import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
    const initialFormData = {
        name: "",
        email: "",
        password: "",
        phone: "",
        yearOfJoining: "",
        role: ""
    };

    const [formData, setFormData] = useState(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.post(
                "http://localhost:8000/api/createUser",
                formData
            );

            setSuccess(res.data.message || "Registration successful!");

            setFormData(initialFormData);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please check your details and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            {/* Decorative background */}
            <div className="register-decoration register-decoration-one"></div>
            <div className="register-decoration register-decoration-two"></div>
            <div className="register-decoration register-decoration-three"></div>

            <div className="register-container">

                {/* Left welcome panel */}
                <section className="register-welcome">

                    <Link to="/" className="register-brand">
                        <div className="register-brand-logo">
                            <img
                                src="/logo/logo.png"
                                alt="Campus Connect Logo"
                            />
                        </div>

                        <span>
                            Campus<span className="register-brand-highlight">
                                Connect
                            </span>
                        </span>
                    </Link>

                    <div className="register-welcome-content">
                        <span className="register-badge">
                            ✨ JOIN OUR COMMUNITY
                        </span>

                        <h1>
                            Your next chapter
                            <br />
                            <span>starts here.</span>
                        </h1>

                        <p>
                            Become part of a connected campus community.
                            Discover events, meet people, share ideas, and
                            create unforgettable experiences.
                        </p>

                        <div className="register-benefits">

                            <div className="register-benefit">
                                <span className="register-benefit-icon">✦</span>
                                <div>
                                    <h4>One Connected Campus</h4>
                                    <p>Stay connected with your college community.</p>
                                </div>
                            </div>

                            <div className="register-benefit">
                                <span className="register-benefit-icon">◎</span>
                                <div>
                                    <h4>Events & Experiences</h4>
                                    <p>Explore activities and campus events.</p>
                                </div>
                            </div>

                            <div className="register-benefit">
                                <span className="register-benefit-icon">↗</span>
                                <div>
                                    <h4>Learn & Grow Together</h4>
                                    <p>Build connections that make a difference.</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="register-welcome-footer">
                        <span className="register-footer-dot"></span>
                        Connect. Collaborate. Grow.
                    </div>
                </section>

                {/* Right registration form */}
                <section className="register-form-section">
                    <div className="register-card">

                        {/* Mobile branding */}
                        <div className="register-mobile-brand">
                            <div className="register-brand-logo">
                                <img
                                    src="/logo/logo.png"
                                    alt="Campus Connect Logo"
                                />
                            </div>

                            <span>
                                Campus<span className="register-brand-highlight">
                                    Connect
                                </span>
                            </span>
                        </div>

                        <div className="register-heading">
                            <div className="register-heading-top">
                                <span className="register-step-label">
                                    GET STARTED
                                </span>

                                <span className="register-step-count">
                                    CREATE ACCOUNT
                                </span>
                            </div>

                            <h2>Create your account</h2>

                            <p>
                                Fill in your details to join Campus Connect.
                            </p>
                        </div>

                        <form
                            className="register-form"
                            onSubmit={handleSubmit}
                        >

                            {error && (
                                <div className="register-message register-message-error"
                                     role="alert">
                                    <span>!</span>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="register-message register-message-success"
                                     role="status">
                                    <span>✓</span>
                                    {success}
                                </div>
                            )}

                            <div className="register-fields-grid">

                                {/* Full name */}
                                <div className="register-field">
                                    <label htmlFor="register-name">
                                        Full Name
                                    </label>

                                    <div className="register-input-wrap">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="register-input-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                        </svg>

                                        <input
                                            id="register-name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            autoComplete="name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="register-field">
                                    <label htmlFor="register-email">
                                        Email Address
                                    </label>

                                    <div className="register-input-wrap">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="register-input-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="14"
                                                rx="2"
                                            />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>

                                        <input
                                            id="register-email"
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

                                {/* Password */}
                                <div className="register-field">
                                    <label htmlFor="register-password">
                                        Password
                                    </label>

                                    <div className="register-input-wrap">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="register-input-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <rect
                                                x="3"
                                                y="11"
                                                width="18"
                                                height="10"
                                                rx="2"
                                            />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>

                                        <input
                                            id="register-password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="register-password-toggle"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="register-field">
                                    <label htmlFor="register-phone">
                                        Phone Number
                                    </label>

                                    <div className="register-input-wrap">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="register-input-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 8.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z" />
                                        </svg>

                                        <input
                                            id="register-phone"
                                            type="tel"
                                            name="phone"
                                            placeholder="Enter phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            autoComplete="tel"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Joining year */}
                                <div className="register-field">
                                    <label htmlFor="register-year">
                                        Year of Joining
                                    </label>

                                    <div className="register-input-wrap">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="register-input-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="16"
                                                rx="2"
                                            />
                                            <path d="M16 3v4M8 3v4M3 10h18" />
                                        </svg>

                                        <input
                                            id="register-year"
                                            type="number"
                                            name="yearOfJoining"
                                            placeholder="e.g. 2026"
                                            min="1900"
                                            max="2100"
                                            value={formData.yearOfJoining}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="register-field">
                                    <label htmlFor="register-role">
                                        Register As
                                    </label>

                                    <div className="register-input-wrap register-select-wrap">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="register-input-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                        </svg>

                                        <select
                                            id="register-role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select your role
                                            </option>
                                            <option value="student">
                                                Student
                                            </option>
                                            <option value="faculty">
                                                Faculty
                                            </option>
                                            <option value="admin">
                                                Admin
                                            </option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="register-submit-btn"
                                disabled={loading}
                            >
                                <span>
                                    {loading
                                        ? "Creating your account..."
                                        : "Create Account"}
                                </span>

                                {!loading && (
                                    <span className="register-submit-arrow">
                                        →
                                    </span>
                                )}
                            </button>

                            <p className="register-terms-note">
                                By creating an account, you agree to follow
                                your campus community guidelines.
                            </p>
                        </form>

                        <div className="register-login-link">
                            <span>Already have an account?</span>
                            <Link to="/login">
                                Sign in <span>↗</span>
                            </Link>
                        </div>

                        <div className="register-card-footer">
                            <span>✦</span>
                            Your campus community awaits.
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Register;
