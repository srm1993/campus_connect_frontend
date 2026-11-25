import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateClub.css";

function CreateClub() {
  const navigate = useNavigate();
  const userid = localStorage.getItem("userid");

  const [formData, setFormData] = useState({
    clubName: "",
    description: "",
    category: "Technical",
    rules: ""
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      setMessageType("error");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      setMessageType("error");
      e.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!userid) {
      setMessage("Please log in before creating a club.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("clubName", formData.clubName.trim());
      data.append("description", formData.description.trim());
      data.append("category", formData.category);
      data.append("rules", formData.rules.trim());
      data.append("createdBy", userid);

      if (image) {
        data.append("image", image);
      }

      const response = await axios.post(
        "http://localhost:8000/club/createClub",
        data
      );

      setMessage(
        response.data.message || "Your club has been created successfully!"
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/allClubs");
      }, 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to create club. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-club-page">
      <div className="club-decoration club-decoration-one"></div>
      <div className="club-decoration club-decoration-two"></div>

      <main className="create-club-wrapper">
        {/* Left Side - Introduction */}
        <section className="club-intro">
          <div className="club-brand">
            <div className="club-brand-icon">✦</div>
            <span>Campus Connect</span>
          </div>

          <span className="club-eyebrow">
            <span className="eyebrow-dot"></span>
            YOUR COMMUNITY STARTS HERE
          </span>

          <h1>
            Bring your
            <br />
            <span>people together.</span>
          </h1>

          <p className="club-intro-description">
            Create a space for ideas, friendships, and collaboration.
            Start a community where students connect, share knowledge,
            and build something extraordinary.
          </p>

          <div className="club-benefits">
            <div className="club-benefit">
              <span className="benefit-icon">✦</span>
              <div>
                <h3>Build your community</h3>
                <p>Bring students with shared interests together.</p>
              </div>
            </div>

            <div className="club-benefit">
              <span className="benefit-icon">↗</span>
              <div>
                <h3>Share your passion</h3>
                <p>Turn your interests into meaningful experiences.</p>
              </div>
            </div>

            <div className="club-benefit">
              <span className="benefit-icon">♡</span>
              <div>
                <h3>Grow together</h3>
                <p>Learn, collaborate, and create lasting memories.</p>
              </div>
            </div>
          </div>

          <div className="club-bottom-note">
            <span className="note-sparkle">✧</span>
            Great communities begin with one idea.
          </div>
        </section>

        {/* Right Side - Create Club Form */}
        <section className="club-form-section">
          <div className="club-form-card">
            <div className="form-topline">
              <span className="form-step">CREATE YOUR SPACE</span>
              <span className="form-step-number">01 / 01</span>
            </div>

            <div className="form-heading">
              <h2>Create a club</h2>
              <p>Make it yours. Give your community a name and purpose.</p>
            </div>

            {message && (
              <div
                className={`club-alert ${
                  messageType === "success"
                    ? "club-alert-success"
                    : "club-alert-error"
                }`}
                role="alert"
              >
                <span>
                  {messageType === "success" ? "✓" : "!"}
                </span>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="club-field">
                <label htmlFor="clubName">
                  Club name <span className="required-star">*</span>
                </label>

                <input
                  type="text"
                  id="clubName"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  placeholder="e.g. The Creative Minds"
                  maxLength={100}
                  required
                />

                <div className="field-helper">
                  Choose a name people will remember.
                </div>
              </div>

              <div className="club-field">
                <label htmlFor="description">
                  About your club <span className="required-star">*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is your club about? What will members do together?"
                  maxLength={2000}
                  rows={4}
                  required
                />

                <div className="field-footer">
                  <span>Tell students what makes your club special.</span>
                  <span>{formData.description.length}/2000</span>
                </div>
              </div>

              <div className="club-field">
                <label htmlFor="category">
                  Choose a category <span className="required-star">*</span>
                </label>

                <div className="category-select-wrap">
                  <span className="category-select-icon">✧</span>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Literary">Literary</option>
                    <option value="Photography">Photography</option>
                    <option value="Entrepreneurship">
                      Entrepreneurship
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="category-preview">
                  <span className="category-chip">
                    {formData.category}
                  </span>
                  <span className="category-preview-text">
                    Your club's area of interest
                  </span>
                </div>
              </div>

              <div className="club-field">
                <label htmlFor="image">Club cover image</label>

                <label
                  htmlFor="image"
                  className={`club-upload-area ${
                    imagePreview ? "has-image" : ""
                  }`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Selected club cover preview"
                      className="club-image-preview"
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">
                        <svg
                          width="27"
                          height="27"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                      </div>

                      <div>
                        <p className="upload-title">
                          Drop your creativity here
                        </p>
                        <p className="upload-description">
                          Click to browse your files
                        </p>
                      </div>

                      <span className="upload-browse">Browse</span>
                    </div>
                  )}
                </label>

                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="club-file-input"
                />

                {image && (
                  <div className="selected-file">
                    <span>✓</span>
                    <span className="selected-file-name">{image.name}</span>
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        URL.revokeObjectURL(imagePreview);
                        setImage(null);
                        setImagePreview("");
                      }}
                      aria-label="Remove selected image"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="field-helper">
                  JPG, PNG, WEBP or GIF · Maximum 5 MB
                </div>
              </div>

              <div className="club-field">
                <label htmlFor="rules">Community rules</label>

                <textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  placeholder="Respect everyone, stay active, be kind..."
                  rows={3}
                />

                <div className="field-helper">
                  Set expectations for a safe and welcoming community.
                </div>
              </div>

              <div className="club-form-divider"></div>

              <button
                type="submit"
                className="create-club-button"
                disabled={loading}
              >
                <span>
                  {loading ? "Creating your club..." : "Create my club"}
                </span>

                {!loading && (
                  <span className="button-arrow" aria-hidden="true">
                    ↗
                  </span>
                )}
              </button>

              <p className="club-form-footer">
                By creating a club, you agree to keep your community
                respectful and inclusive.
              </p>
            </form>
          </div>

          <p className="club-outside-note">
            Made for students, powered by community <span>✦</span>
          </p>
        </section>
      </main>
    </div>
  );
}

export default CreateClub;