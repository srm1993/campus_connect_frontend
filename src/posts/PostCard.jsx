import { useState } from "react";
import axios from "axios";
import "./PostCard.css"

function PostCard({ post, onUpdate, onDelete }) {

    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(post.content || "");

    const user = JSON.parse(localStorage.getItem("user"));

    const userId = user?._id || user?.userid;

    const isOwner =
        post.createdBy?._id?.toString() === userId?.toString() ||
        post.createdBy?.toString() === userId?.toString();

    const isAdmin = user?.role === "admin";

    const liked = post.likes?.some(
        item => (item._id || item).toString() === userId?.toString()
    );

    const headers = {
        Authorization: `Bearer ${user?.token}`
    };

    // LIKE / UNLIKE POST
    const likePost = async () => {
        try {
            await axios.put(
                `http://localhost:8000/post/likePost/${post._id}`,
                {userId:userId},
                { headers }
            );

            onUpdate();

        } catch (error) {
            alert(error.response?.data?.message || "Unable to like post");
        }
    };

    // ADD COMMENT
    const addComment = async () => {
        if (!comment.trim()) return;

        try {
            await axios.post(
                `http://localhost:8000/post/addComment/${post._id}`,
                { text: comment,userId:userId },
                { headers }
            );

            setComment("");
            onUpdate();

        } catch (error) {
            alert(error.response?.data?.message || "Unable to comment");
        }
    };

    // EDIT OWN POST
    const editPost = async () => {
        if (!content.trim() && !post.image) {
            alert("Post must contain text or an image");
            return;
        }

        try {
            await axios.put(
                `http://localhost:8000/post/editPost/${post._id}`,
                { content, userId, role: user.role },
                { headers }
            );

            setEditing(false);
            onUpdate();

        } catch (error) {
            alert(error.response?.data?.message || "Unable to edit post");
        }
    };

    // DELETE POST
    const deletePost = async () => {

        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8000/post/deletePost/${post._id}`,
                {
                    data: {
                        userId: userId,
                        role: user.role
                    },
                }
            );

            onDelete(post._id);

        } catch (error) {
            alert(error.response?.data?.message || "Unable to delete post");
        }
    };

    // SHARE POST
    const sharePost = async () => {

        const url = `${window.location.origin}/posts/${post._id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Campus Connect",
                    text: post.content || "Check out this campus post!",
                    url
                });
                await axios.put(
                `http://localhost:8000/post/sharePost/${post._id}`,
                {userId:userId},
                { headers }
            );
            } else {
                await navigator.clipboard.writeText(url);
                alert("Post link copied successfully!");
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                alert("Unable to share post");
            }
        }
    };

    // SOCIAL MEDIA SHARE
    const postUrl = encodeURIComponent(
        `${window.location.origin}/posts/${post._id}`
    );

    const postText = encodeURIComponent(
        post.content || "Check out this campus post!"
    );

    return (
        <div className="post-card">

            {/* POST HEADER */}
            <div className="post-header">

                <div className="post-user-info">

                    <div className="post-avatar">
                        {post.createdBy?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h3>{post.createdBy?.name}</h3>

                        <span className="post-role">
                            {post.createdBy?.role}
                        </span>

                        <small>
                            {new Date(post.createdAt).toLocaleString()}
                        </small>
                    </div>

                </div>

                {/* EDIT AND DELETE OPTIONS */}
                {(isOwner || isAdmin) && (
                    <div className="post-options">

                        {isOwner && !isAdmin && (
                            <button onClick={() => {
                                setContent(post.content || "");
                                setEditing(true);
                            }}>
                                ✏️ Edit
                            </button>
                        )}

                        <button
                            className="delete-btn"
                            onClick={deletePost}
                        >
                            🗑️ Delete
                        </button>

                    </div>
                )}

            </div>

            {/* POST CONTENT */}
            {editing ? (

                <div className="edit-post">

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Edit your post..."
                    />

                    <div className="edit-actions">

                        <button onClick={editPost}>
                            Save Changes
                        </button>

                        <button
                            onClick={() => {
                                setEditing(false);
                                setContent(post.content || "");
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            ) : (

                <>
                    {post.content && (
                        <p className="post-content">
                            {post.content}
                        </p>
                    )}

                    {/* SINGLE POST IMAGE */}
                    {post.image && (
                        <div className="post-image">
                            <img
                                src={`http://localhost:8000${post.image}`}
                                alt="Post attachment"
                            />
                        </div>
                    )}
                </>

            )}

            {/* POST ACTIONS */}
            <div className="post-actions">

                <button
                    onClick={likePost}
                    className={liked ? "liked" : ""}
                >
                    {liked ? "❤️ Liked" : "🤍 Like"}
                    ({post.likes?.length || 0})
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                >
                    💬 Comment ({post.comments?.length || 0})
                </button>

                <button onClick={sharePost}>
                    🔗 Share
                    ({post.share?.length || 0})
                </button>

            </div>

            {/* COMMENTS */}
            {showComments && (

                <div className="comments-section">

                    {post.comments?.map((item) => (

                        <div key={item._id} className="comment">

                            <strong>
                                {item.user?.name || "User"}
                            </strong>

                            <p>{item.text}</p>

                        </div>

                    ))}

                    <div className="comment-input">

                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") addComment();
                            }}
                        />

                        <button onClick={addComment}>
                            Send
                        </button>

                    </div>

                </div>
            )}
        </div>
    );
}

export default PostCard;
