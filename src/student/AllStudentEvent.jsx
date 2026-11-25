
import axios from "axios";
import { useEffect, useState } from "react";
import "./AllStudentEvent.css";

function AllStudentEvent() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [processingId, setProcessingId] = useState(null);

    const role = localStorage.getItem("role")?.trim().toLowerCase();
    const userid = localStorage.getItem("userid");

    // Fetch all events
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/allEvent")
            .then((res) => {
                setEvents(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage(
                    "Unable to load events. Please try again."
                );
            })
            .finally(() => setLoading(false));
    }, []);

    // Delete event
    const deleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }

        setProcessingId(id);

        try {
            const res = await axios.delete(
                `http://localhost:8000/api/deleteEvent/${id}`
            );

            alert(res.data.message || "Event deleted successfully.");

            setEvents((currentEvents) =>
                currentEvents.filter((event) => event._id !== id)
            );
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to delete event."
            );
        } finally {
            setProcessingId(null);
        }
    };

    // Register for event
    const registerEvent = async (eventId) => {
        if (!userid) {
            alert("Please log in to register for this event.");
            return;
        }

        setProcessingId(eventId);

        try {
            const res = await axios.post(
                "http://localhost:8000/api/registerEvent",
                {
                    eventId,
                    userId: userid,
                }
            );

            alert(
                res.data.message || "Event registration successful."
            );
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to register for the event."
            );
        } finally {
            setProcessingId(null);
        }
    };

    // Format event date
    const formatDate = (dateValue) => {
        if (!dateValue) return "Not specified";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Format event time
    const formatTime = (time) => {
        if (!time) return "Not specified";

        const [hours, minutes] = time.split(":");
        const date = new Date();

        date.setHours(Number(hours), Number(minutes), 0, 0);

        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Loading screen
    if (loading) {
        return (
            <div className="all-event-page">
                <div className="events-loading">
                    <div className="event-spinner"></div>
                    <p>Discovering campus events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="all-event-page">

            {/* Hero section */}
            <section className="events-hero">
                <div className="events-hero-content">
                    <span className="events-eyebrow">
                        CAMPUS CONNECT · WHAT'S HAPPENING
                    </span>

                    <h1>
                        Discover Your Next <span>Big Moment.</span>
                    </h1>

                    <p>
                        Explore campus events, meet new people, learn new
                        skills, and make every campus experience unforgettable.
                    </p>

                    <div className="events-hero-stats">
                        <div>
                            <strong>{events.length}</strong>
                            <span>Total Events</span>
                        </div>

                        <div className="hero-stat-divider"></div>

                        <div>
                            <strong>
                                {
                                    new Set(
                                        events
                                            .map((event) => event.category)
                                            .filter(Boolean)
                                    ).size
                                }
                            </strong>
                            <span>Categories</span>
                        </div>
                    </div>
                </div>

                <div className="events-hero-art" aria-hidden="true">
                    <div className="event-art-circle circle-one"></div>
                    <div className="event-art-circle circle-two"></div>
                    <div className="event-art-star">✦</div>

                    <div className="event-art-ticket">
                        <span>✧</span>
                        <strong>YOUR</strong>
                        <strong>NEXT</strong>
                        <strong>EVENT</strong>
                        <span className="ticket-bottom">
                            ✦ CAMPUS CONNECT
                        </span>
                    </div>
                </div>
            </section>

            {/* Events section */}
            <section className="events-content">
                <div className="events-section-heading">
                    <div>
                        <span className="events-section-label">
                            THE CAMPUS CALENDAR
                        </span>

                        <h2>Explore Events</h2>

                        <p>
                            Find something exciting happening around your campus.
                        </p>
                    </div>

                    <div className="events-total-pill">
                        <span className="events-total-dot"></span>
                        {events.length}{" "}
                        {events.length === 1 ? "Event" : "Events"}
                    </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <div className="events-error">
                        {errorMessage}
                    </div>
                )}

                {/* Events grid */}
                {!errorMessage && events.length > 0 && (
                    <div className="events-grid">
                        {events.map((event, index) => (
                            <article
                                className="event-card"
                                key={event._id}
                            >
                                {/* Event image */}
                                <div className="event-image-wrapper">
                                    {event.image ? (
                                        <img
                                            className="event-cover-image"
                                            src={`http://localhost:8000${event.image}`}
                                            alt={event.title || "Campus event"}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="event-image-placeholder">
                                            <span>✦</span>
                                            <p>Campus Connect</p>
                                        </div>
                                    )}

                                    <span className="event-category-badge">
                                        {event.category || "Campus Event"}
                                    </span>

                                    <span className="event-number">
                                        EVENT {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Event details */}
                                <div className="event-card-body">
                                    <div className="event-type-line">
                                        <span className="event-type-dot"></span>
                                        {event.eventType || "General Event"}
                                    </div>

                                    <h3 className="event-card-title">
                                        {event.title || "Untitled Event"}
                                    </h3>

                                    <p className="event-description">
                                        {event.description ||
                                            "Join us for this exciting campus event."}
                                    </p>

                                    {/* Event information */}
                                    <div className="event-details-list">
                                        <div className="event-detail-row">
                                            <span className="event-detail-icon">
                                                ▦
                                            </span>
                                            <div>
                                                <label>Event Date</label>
                                                <p>
                                                    {formatDate(event.eventDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="event-detail-row">
                                            <span className="event-detail-icon">
                                                ◷
                                            </span>
                                            <div>
                                                <label>Event Time</label>
                                                <p>
                                                    {formatTime(event.startTime)}
                                                    {" – "}
                                                    {formatTime(event.endTime)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="event-detail-row">
                                            <span className="event-detail-icon">
                                                ⌖
                                            </span>
                                            <div>
                                                <label>Venue</label>
                                                <p>
                                                    {event.venue || "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="event-detail-row">
                                            <span className="event-detail-icon">
                                                ♙
                                            </span>
                                            <div>
                                                <label>Organized By</label>
                                                <p>
                                                    {event.organizer ||
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="event-detail-row">
                                            <span className="event-detail-icon">
                                                ▤
                                            </span>
                                            <div>
                                                <label>
                                                    Registration Deadline
                                                </label>
                                                <p>
                                                    {formatDate(
                                                        event.registrationDeadline
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="event-detail-row">
                                            <span className="event-detail-icon">
                                                ♧
                                            </span>
                                            <div>
                                                <label>
                                                    Maximum Participants
                                                </label>
                                                <p>
                                                    {event.maxParticipants ??
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Creator and status */}
                                    <div className="event-card-meta">
                                        <div className="event-creator">
                                            <div className="creator-avatar">
                                                {event.createdBy?.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "C"}
                                            </div>

                                            <div>
                                                <label>Created By</label>
                                                <p>
                                                    {event.createdBy?.name ||
                                                        "Campus Team"}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`event-status status-${String(
                                                event.status || "upcoming"
                                            )
                                                .toLowerCase()
                                                .replace(/[^a-z0-9]+/g, "-")}`}
                                        >
                                            {event.status || "Upcoming"}
                                        </span>
                                    </div>

                                    {/* Role-based actions */}
                                    {(role === "admin" ||
                                        role === "faculty" ||
                                        role === "student") && (
                                        <div className="event-card-actions">

                                            {/* Admin and faculty can delete */}
                                            {(role === "admin" ||
                                                role === "faculty") && (
                                                <button
                                                    type="button"
                                                    className="event-delete-btn"
                                                    disabled={
                                                        processingId === event._id
                                                    }
                                                    onClick={() =>
                                                        deleteEvent(event._id)
                                                    }
                                                >
                                                    {processingId === event._id
                                                        ? "Please wait..."
                                                        : "⌫ Delete Event"}
                                                </button>
                                            )}

                                            {/* Students can register */}
                                            {role === "student" && (
                                                <button
                                                    type="button"
                                                    className="event-register-btn"
                                                    disabled={
                                                        processingId === event._id
                                                    }
                                                    onClick={() =>
                                                        registerEvent(event._id)
                                                    }
                                                >
                                                    {processingId === event._id
                                                        ? "Registering..."
                                                        : "Register for Event →"}
                                                </button>
                                            )}

                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!errorMessage && events.length === 0 && (
                    <div className="events-empty">
                        <div className="events-empty-icon">✦</div>
                        <h3>No Events Yet</h3>
                        <p>
                            There are no campus events to display right now.
                            Check back soon for something exciting!
                        </p>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="events-page-footer">
                <span>✦</span> Making campus life more memorable, one event
                at a time.
            </footer>
        </div>
    );
}

export default AllStudentEvent;
