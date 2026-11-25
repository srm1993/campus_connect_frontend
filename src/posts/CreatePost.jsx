
import { useState, useEffect } from "react";
import axios from "axios";
import "./CreatePost.css"

function CreatePost({ onPostCreated }) {

    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!image) {
            setPreview("");
            return;
        }

        const url = URL.createObjectURL(image);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (!validTypes.includes(file.type)) {
            alert("Only JPG, PNG, WEBP and GIF images are allowed");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be below 5 MB");
            e.target.value = "";
            return;
        }

        setImage(file);
        e.target.value = "";
    };

    const createPost = async () => {

        if (!content.trim() && !image) {
            alert("Write something or upload an image");
            return;
        }

        const formData = new FormData();

        formData.append("content", content);
        formData.append("userid",user._id)
        formData.append("role",user.role)
        if (image) {
            formData.append("image", image);
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:8000/post/createPost",
                formData
            );

            onPostCreated(response.data.post);

            setContent("");
            setImage(null);

            alert("Post created successfully!");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to create post"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post">

            <h3>Create Post</h3>

            <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            {preview && (
                <div className="image-preview">

                    <div className="preview-item">

                        <img src={preview} alt="Post preview"/>

                        <button
                            type="button"
                            onClick={() => setImage(null)}
                        >
                            ×
                        </button>

                    </div>

                </div>
            )}

            <div className="create-post-footer">

                <label className="upload-image-btn">
                    📷 Photo

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        hidden
                        onChange={handleImageChange}
                    />
                </label>

                <span>
                    {image ? "1 image selected" : "No image selected"}
                </span>

                <button
                    onClick={createPost}
                    disabled={loading}
                >
                    {loading ? "Posting..." : "Post"}
                </button>

            </div>

        </div>
    );
}

export default CreatePost;
