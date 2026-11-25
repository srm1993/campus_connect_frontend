import axios from "axios";
import { useEffect, useState } from "react";
import "./AllUser.css";

function AllUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get("http://localhost:8000/api/allUser")
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => console.log(err));
    };

    const changeStatus = (id) => {
        axios.get(`http://localhost:8000/api/changeStatus/${id}`)
            .then(res => {
                alert(res.data.message);
                fetchUsers();
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="all-students-page">
            <div className="students-header">
                <div>
                    <h2>Student Management</h2>
                    <p>View and manage all registered students.</p>
                </div>

                <div className="student-count">
                    <span>Total Students</span>
                    <h3>{users.filter(user => user.role === "student").length}</h3>
                </div>
            </div>

            <div className="students-grid">
                {users.filter(user => user.role === "student").map((user, index) => (
                    <div className="student-card" key={user._id}>
                        <div className="student-card-header">
                            <div className="student-avatar">
                                {user.name?.charAt(0).toUpperCase() || "S"}
                            </div>

                            <span
                                className={`student-status ${
                                    user.status?.toLowerCase() === "active"
                                        ? "status-active"
                                        : "status-inactive"
                                }`}
                            >
                                {user.status || "Unknown"}
                            </span>
                        </div>

                        <div className="student-info">
                            <h3>{user.name}</h3>
                            <p className="student-number">
                                Student #{String(index + 1).padStart(3, "0")}
                            </p>
                        </div>

                        <div className="student-details">
                            <div className="detail-item">
                                <span className="detail-icon">✉</span>
                                <div>
                                    <label>Email Address</label>
                                    <p>{user.email}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <span className="detail-icon">☎</span>
                                <div>
                                    <label>Phone Number</label>
                                    <p>{user.phone || "Not provided"}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <span className="detail-icon">📅</span>
                                <div>
                                    <label>Year of Joining</label>
                                    <p>{user.yearOfJoining || "Not provided"}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <span className="detail-icon">🎓</span>
                                <div>
                                    <label>Role</label>
                                    <p>{user.role}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            className={`change-status-btn ${
                                user.status?.toLowerCase() === "active"
                                    ? "deactivate-btn"
                                    : "activate-btn"
                            }`}
                            onClick={() => changeStatus(user._id)}
                        >
                            {user.status?.toLowerCase() === "active"
                                ? "Deactivate Student"
                                : "Activate Student"}
                        </button>
                    </div>
                ))}
            </div>

            {users.filter(user => user.role === "student").length === 0 && (
                <div className="empty-students">
                    <div className="empty-icon">🎓</div>
                    <h3>No Students Found</h3>
                    <p>Registered students will appear here.</p>
                </div>
            )}
        </div>
    );
}

export default AllUser;