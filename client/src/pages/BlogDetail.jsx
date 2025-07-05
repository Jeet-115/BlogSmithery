import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, toggleLikePost } from "../services/postService";
import CommentSection from "../components/CommentSection";
import { useSelector } from "react-redux";
import { toggleFollowUser } from "../services/followService";
import {
  FaHeart,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaShareAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostById(id);
      setPost(data);
      if (user && data.likes.includes(user._id)) {
        setLiked(true);
      }
      if (user && data.author?.followers?.includes(user._id)) {
        setIsFollowing(true);
      }
    };
    fetchPost();
  }, [id, user]);

  const handleFollow = async () => {
    if (!user) return toast.error("Please login to follow!");
    try {
      const res = await toggleFollowUser(post.author._id);
      setIsFollowing(res.following);
      toast.success(res.following ? "Followed" : "Unfollowed");
    } catch (err) {
      console.error("Follow error:", err);
      toast.error("Action failed");
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like!");
    const res = await toggleLikePost(id);
    setLiked(res.liked);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/public-blog/${post._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (!post)
    return (
      <p className="text-center py-10 text-[#37474F] text-lg">Loading...</p>
    );

  const currentURL = `${window.location.origin}/public-blog/${post._id}`;

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>{post.title} | Blogsmithery</title>
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:description" content={post.tags?.join(", ")} />
        <meta property="og:url" content={currentURL} />
      </Helmet>

      {/* Title + Metadata */}
      <motion.div
        className="mb-6 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl font-bold text-[#1C2B33]">{post.title}</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-[#546E7A]">
            by{" "}
            <span className="font-medium">
              {post.author?.name || "Unknown"}
            </span>{" "}
            • {new Date(post.createdAt).toLocaleDateString()} • {post.category}
          </p>

          {/* Share Icons */}
          <div className="flex items-center gap-4 text-lg">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                currentURL
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebook />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                currentURL
              )}&text=Check out this blog!`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 hover:text-sky-700"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(currentURL)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600"
            >
              <FaWhatsapp />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                currentURL
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <FaLinkedin />
            </a>
            <button
              onClick={handleShare}
              className="text-[#00838F] hover:text-[#006064]"
              title="Copy link"
            >
              <FaShareAlt />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Cover Image */}
      {post.coverImage && (
        <motion.img
          src={post.coverImage}
          alt="cover"
          className="w-full h-auto object-cover rounded-2xl shadow-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}

      {/* Blog Content */}
      <motion.div
        className="prose prose-lg max-w-none bg-white/80 backdrop-blur border border-[#B0BEC5] rounded-xl p-6 shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      />

      {/* Like Button */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleLike}
          className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm font-semibold transition-colors ${
            liked
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 text-[#1C2B33] hover:bg-gray-300"
          }`}
        >
          <FaHeart className="text-base" />
          {liked ? "Liked" : "Like"} ({post.likes.length})
        </button>
      </motion.div>

      {/* Comment Section */}
      <div className="mt-10">
        <CommentSection
          postId={post._id}
          postAuthorId={post.author._id}
          open={true}
        />
      </div>

      {/* Author Section */}
      <motion.div
        onClick={() => navigate(`/dashboard/author/${post.author._id}`)}
        className="mt-12 border-t border-[#B0BEC5] pt-6 cursor-pointer"
        whileHover={{ scale: 1.01 }}
      >
        <h4 className="text-xl font-semibold text-[#1C2B33] mb-3">
          About the Author
        </h4>

        {/* Author Card */}
        <div className="p-5 bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-xl shadow-md">
          <p className="font-medium text-[#37474F] text-lg">
            {post.author?.name || "Unknown"}
          </p>
          <p className="text-sm text-[#546E7A]">
            Joined on{" "}
            {post.author?.createdAt
              ? new Date(post.author.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : "Unknown"}
          </p>
          <div className="flex gap-6 mt-2 text-sm text-[#37474F]">
            <span>{post.author?.followers?.length || 0} Followers</span>
            <span>{post.author?.following?.length || 0} Following</span>
          </div>
          {/* Follow Button inside the card */}
          {user && user._id !== post.author._id && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // 🚫 Prevent navigate
                handleFollow();
              }}
              className={`mt-4 px-4 py-1 rounded-full text-sm font-medium shadow transition ${
                isFollowing
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-[#00838F] text-white hover:bg-[#006064]"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogDetail;
