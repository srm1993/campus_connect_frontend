import PostFeed from "./posts/PostFeed";
import './AllPost.css';

function AllPosts() {
    return (
        <div className="all-posts-page">
            <PostFeed />
        </div>
    );
}

export default AllPosts;