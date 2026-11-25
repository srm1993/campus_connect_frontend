
import "./Profile.css";

function Profile() {
    const user = JSON.parse(localStorage.getItem("user")) || {};

    const initials = user.name
        ? user.name.charAt(0).toUpperCase()
        : "U";

    return (
        <div className="profile-page">
            <div className="profile-container">

                <div className="profile-header">
                    <div className="profile-avatar">
                        {initials}
                    </div>

                    <h2>{user.name || "User Name"}</h2>
                    <p>{user.email || "No email available"}</p>

                    <div className="profile-badges">
                        <span className="role-badge">
                            {user.role || "User"}
                        </span>

                        <span className={`status-badge ${
                            user.status === "active" ? "active" : "inactive"
                        }`}>
                            {user.status || "Unknown"}
                        </span>
                    </div>
                </div>

                <div className="profile-body">
                    <h3>Personal Information</h3>
                    <p className="profile-subtitle">
                        Your account information and personal details
                    </p>

                    <div className="profile-details">

                        <div className="detail-card">
                            <span className="detail-icon">👤</span>
                            <div>
                                <label>Full Name</label>
                                <h4>{user.name || "N/A"}</h4>
                            </div>
                        </div>

                        <div className="detail-card">
                            <span className="detail-icon">✉️</span>
                            <div>
                                <label>Email Address</label>
                                <h4>{user.email || "N/A"}</h4>
                            </div>
                        </div>

                        <div className="detail-card">
                            <span className="detail-icon">📞</span>
                            <div>
                                <label>Phone Number</label>
                                <h4>{user.phone || "N/A"}</h4>
                            </div>
                        </div>

                        <div className="detail-card">
                            <span className="detail-icon">🎓</span>
                            <div>
                                <label>Role</label>
                                <h4>{user.role || "N/A"}</h4>
                            </div>
                        </div>

                        <div className="detail-card">
                            <span className="detail-icon">📅</span>
                            <div>
                                <label>Year of Joining</label>
                                <h4>{user.yearOfJoining || "N/A"}</h4>
                            </div>
                        </div>

                        <div className="detail-card">
                            <span className="detail-icon">🛡️</span>
                            <div>
                                <label>Account Status</label>
                                <h4>{user.status || "N/A"}</h4>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Profile;
