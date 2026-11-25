import { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import "./PostFeed.css"

function PostFeed() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    const headers = {
        Authorization: `Bearer ${user?.token}`
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/post/allPosts",
                { headers }
            );

            setPosts(response.data);

        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleNewPost = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handleDelete = (id) => {
        setPosts(prev => prev.filter(post => post._id !== id));
    };

    if (loading) {
        return <h3>Loading posts...</h3>;
    }

    return (
        <div className="post-feed">

            {user?.role !== "admin" && (
                <CreatePost onPostCreated={handleNewPost} />
            )}

            <h2>Campus Connect Feed</h2>

            {posts.length === 0 ? (
                <p>No posts available. Be the first to share!</p>
            ) : (
                posts.map(post => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onUpdate={fetchPosts}
                        onDelete={handleDelete}
                    />
                ))
            )}

        </div>
    );
}

export default PostFeed;
