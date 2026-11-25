import { useState } from "react";
import axios from "axios";
import "./CreateFacultyEvent.css";

const initialFormData = {
    title: "",
    description: "",
    category: "",
    eventType: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    organizer: "",
    registrationDeadline: "",
    maxParticipants: "",
};

function CreateFacultyEvent() {
    const [myFormData, setFormData] = useState(initialFormData);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0] || null;
        setImage(selectedImage);
        setErrorMessage("");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        if (myFormData.endTime <= myFormData.startTime) {
            setErrorMessage("End time must be later than start time.");
            setLoading(false);
            return;
        }

        if (myFormData.registrationDeadline > myFormData.eventDate) {
            setErrorMessage(
                "Registration deadline cannot be after the event date."
            );
            setLoading(false);
            return;
        }

        const payload = new FormData();

        Object.entries(myFormData).forEach(([key, value]) => {
            payload.append(key, value);
        });

        payload.append("createdBy", localStorage.getItem("userid") || "");

        if (image) {
            payload.append("image", image);
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/createEvent",
                payload
            );

            setSuccessMessage(
                response.data.message ||
                response.data.massege ||
                "Your event has been created successfully!"
            );

            setFormData(initialFormData);
            setImage(null);

            const fileInput = document.getElementById("event-image");
            if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error(error);

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data?.massege ||
                "Unable to create the event. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-event-page">
            <div className="event-hero">
                <div className="hero-content">
                    <span className="hero-tag">CAMPUS CONNECT · EVENTS</span>
                    <h1>Bring Your Campus to Life.</h1>
                    <p>
                        Create memorable experiences, bring students together,
                        and turn your next big idea into an amazing campus event.
                    </p>
                </div>

                <div className="hero-decoration">
                    <div className="hero-orbit orbit-one"></div>
                    <div className="hero-orbit orbit-two"></div>
                    <div className="hero-icon">✦</div>
                    <span className="floating-star star-one">✧</span>
                    <span className="floating-star star-two">✦</span>
                </div>
            </div>

            <div className="event-form-wrapper">
                <div className="event-form-heading">
                    <div>
                        <span className="section-eyebrow">EVENT WORKSPACE</span>
                        <h2>Create a New Event</h2>
                        <p>Fill in the details below to publish your campus event.</p>
                    </div>

                    <div className="form-badge">
                        <span className="badge-dot"></span>
                        New Event
                    </div>
                </div>

                {errorMessage && (
                    <div className="event-alert event-alert-error">
                        <span>!</span>
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="event-alert event-alert-success">
                        <span>✓</span>
                        {successMessage}
                    </div>
                )}

                <form className="event-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-section-title">
                            <span className="section-icon">✦</span>
                            <div>
                                <h3>Event Information</h3>
                                <p>Tell everyone what your event is about.</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="title">Event Title <span>*</span></label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={myFormData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Annual Tech Innovation Summit"
                                    required
                                    maxLength={150}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">Event Description <span>*</span></label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={myFormData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the event, its purpose, activities, and what attendees can expect..."
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category <span>*</span></label>
                                <select
                                    id="category"
                                    name="category"
                                    value={myFormData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choose a category</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="eventType">Event Type <span>*</span></label>
                                <select
                                    id="eventType"
                                    name="eventType"
                                    value={myFormData.eventType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choose event type</option>
                                    <option value="College">College</option>
                                    <option value="Department">Department</option>
                                    <option value="Club">Club</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-title">
                            <span className="section-icon">◷</span>
                            <div>
                                <h3>Schedule & Location</h3>
                                <p>Set the date, timing, and venue.</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="eventDate">Event Date <span>*</span></label>
                                <input
                                    id="eventDate"
                                    type="date"
                                    name="eventDate"
                                    value={myFormData.eventDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="registrationDeadline">Registration Deadline <span>*</span></label>
                                <input
                                    id="registrationDeadline"
                                    type="date"
                                    name="registrationDeadline"
                                    value={myFormData.registrationDeadline}
                                    onChange={handleChange}
                                    max={myFormData.eventDate || undefined}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="startTime">Start Time <span>*</span></label>
                                <input
                                    id="startTime"
                                    type="time"
                                    name="startTime"
                                    value={myFormData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endTime">End Time <span>*</span></label>
                                <input
                                    id="endTime"
                                    type="time"
                                    name="endTime"
                                    value={myFormData.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="venue">Venue <span>*</span></label>
                                <input
                                    id="venue"
                                    type="text"
                                    name="venue"
                                    value={myFormData.venue}
                                    onChange={handleChange}
                                    placeholder="e.g. Main Auditorium"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="organizer">Organizer <span>*</span></label>
                                <input
                                    id="organizer"
                                    type="text"
                                    name="organizer"
                                    value={myFormData.organizer}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Science Department"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section last-section">
                        <div className="form-section-title">
                            <span className="section-icon">♧</span>
                            <div>
                                <h3>Registration & Cover Image</h3>
                                <p>Set your attendee limit and make the event stand out.</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="maxParticipants">Maximum Participants <span>*</span></label>
                                <input
                                    id="maxParticipants"
                                    type="number"
                                    name="maxParticipants"
                                    value={myFormData.maxParticipants}
                                    onChange={handleChange}
                                    placeholder="e.g. 200"
                                    min="1"
                                    required
                                />
                                <small>Set the maximum number of attendees.</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-image">Event Cover Image</label>

                                <label className="image-upload-box" htmlFor="event-image">
                                    <span className="upload-icon">↑</span>
                                    <strong>{image ? image.name : "Choose an event image"}</strong>
                                    <span>Click to browse files from your device</span>
                                    <small>PNG, JPG, or WEBP recommended</small>
                                </label>

                                <input
                                    id="event-image"
                                    className="hidden-file-input"
                                    type="file"
                                    name="image"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                />

                                {image && (
                                    <div className="selected-image">
                                        <span>✓ Image selected</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImage(null);
                                                const input = document.getElementById("event-image");
                                                if (input) input.value = "";
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-footer">
                        <p><span>*</span> Required fields must be completed.</p>
                        <button
                            type="submit"
                            className="create-event-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating Event..." : "✦  Create Event"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="event-page-footer">
                Made for memorable campus moments <span>♥</span>
            </div>
        </div>
    );
}

export default CreateFacultyEvent;