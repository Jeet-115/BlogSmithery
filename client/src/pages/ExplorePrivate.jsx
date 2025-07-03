import { useEffect, useState, useRef, useCallback } from "react";
import { getExplorePostsPrivate } from "../services/exploreService";
import { toggleLikePost } from "../services/postService";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import CommentSection from "../components/CommentSection";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const ExplorePrivate = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [openCommentId, setOpenCommentId] = useState(null);
  const navigate = useNavigate();

  const observer = useRef();

  const categories = [
    "Personal & Lifestyle",
    "Business & Career",
    "Finance & Money",
    "Technology & Innovation",
    "Education & Learning",
    "Health & Wellness",
    "Travel & Culture",
    "Food & Drink",
    "Home & Living",
    "Art & Creativity",
    "Fashion & Beauty",
    "Entertainment & Pop Culture",
    "Sports & Fitness",
    "Politics & Society",
    "Science & Nature",
    "Philosophy & Spirituality",
    "DIY & How-To",
    "Family & Relationships",
    "Opinions & Commentary",
    "Hobbies & Niche Interests",
  ];

  const handleLike = async (postId) => {
    try {
      const result = await toggleLikePost(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: result.liked
                  ? [...post.likes, user._id]
                  : post.likes.filter((id) => id !== user._id),
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post", err);
      toast.error("Failed to like the post");
    }
  };

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await getExplorePostsPrivate({
        page,
        search,
        category,
        sort,
      });
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const unique = data.filter((p) => !ids.has(p._id));
        return [...prev, ...unique];
      });
      setHasMore(data.length > 0);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort, loading, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = debounce((e) => {
    setSearch(e.target.value);
    setPage(1);
    setPosts([]);
    setHasMore(true);
  }, 500);

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
    setPosts([]);
    setHasMore(true);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    setPage(1);
    setPosts([]);
    setHasMore(true);
  };

  return (
    <section className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      {/* Heading */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-[#1C2B33] text-center outfit"
      >
        🔍 Explore Other Blogs
      </motion.h2>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-10"
      >
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search by title, tag, or author"
          className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white"
        />

        <select
          onChange={handleCategory}
          value={category}
          className="w-full md:w-1/4 px-4 py-2 border border-[#B0BEC5] rounded-lg shadow-sm focus:outline-none bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          onChange={handleSort}
          value={sort}
          className="w-full md:w-1/4 px-4 py-2 border border-[#B0BEC5] rounded-lg shadow-sm focus:outline-none bg-white"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Liked</option>
        </select>
      </motion.div>

      {/* Blog Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
      >
        {posts.map((post, idx) => (
          <motion.div
            key={post._id}
            ref={idx === posts.length - 1 ? lastPostRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/dashboard/blog/${post._id}`)}
            className="bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-3xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt="cover"
                className="w-full h-52 object-cover"
              />
            )}

            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="font-semibold text-lg text-[#1C2B33] mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-[#546E7A]">
                  by {post.author?.name || "Anonymous"} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-[#78909C] mt-1">
                  {post.tags?.join(", ")} • {post.category}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                {/* Like */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post._id);
                  }}
                  className="text-sm bg-pink-100 hover:bg-pink-200 text-pink-600 px-4 py-1 rounded-full transition"
                >
                  ❤️ {post.likes.length}
                </button>

                {/* Comment Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCommentId((prev) =>
                      prev === post._id ? null : post._id
                    );
                  }}
                  className="text-sm text-[#00838F] hover:underline transition"
                >
                  💬 {openCommentId === post._id ? "Hide" : "Comment"}
                </button>
              </div>

              {/* Comments */}
              <div className="mt-2">
                <CommentSection
                  postId={post._id}
                  open={openCommentId === post._id}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Loading / No More */}
      <div className="text-center mt-8">
        {loading && (
          <p className="text-[#00838F] text-sm animate-pulse">Loading more blogs...</p>
        )}
        {!hasMore && !loading && (
          <p className="text-gray-500 text-sm">🚫 No more blogs to load.</p>
        )}
      </div>
    </section>
  );
};

export default ExplorePrivate;
