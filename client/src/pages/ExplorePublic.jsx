import { useEffect, useState, useRef, useCallback } from "react";
import { getExplorePostsPublic } from "../services/exploreService";
import { debounce } from "lodash";
import LoginPromptModal from "../components/LoginPromptModal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ExplorePublic = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");
  const [showModal, setShowModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
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

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await getExplorePostsPublic({
        page,
        search,
        category,
        sort,
      });

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newPosts = data.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newPosts];
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

  const triggerLoginModal = (target = "/dashboard/explore") => {
    setRedirectPath(target);
    setShowModal(true);
  };

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto min-h-screen font-outfit">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="mb-4 flex items-center text-[#00838F] hover:text-[#006064] transition-colors text-sm font-medium bg-white/80 px-4 py-2 rounded-full shadow border border-[#B0BEC5]"
      >
        <span className="mr-2 text-lg">←</span> Back to Home
      </motion.button>
      {/* Heading */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-bold text-[#1C2B33] text-center mb-8"
      >
        🌐 Explore Blogs
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
          className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg shadow-sm focus:ring-2 focus:ring-[#00838F] bg-white"
        />
        <select
          onChange={handleCategory}
          value={category}
          className="w-full md:w-1/4 px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white"
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
          className="w-full md:w-1/4 px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Liked</option>
        </select>
      </motion.div>

      {/* Blog Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {posts.map((post, idx) => (
          <motion.div
            key={post._id}
            ref={idx === posts.length - 1 ? lastPostRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/public-blog/${post._id}`)}
            className="bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-3xl shadow-lg overflow-hidden cursor-pointer transition-all"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerLoginModal();
                  }}
                  className="text-sm bg-pink-100 hover:bg-pink-200 text-pink-600 px-4 py-1 rounded-full"
                >
                  ❤️ Like
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerLoginModal();
                  }}
                  className="text-sm text-[#00838F] hover:underline"
                >
                  💬 Comment
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Status */}
      <div className="text-center mt-10">
        {loading && (
          <p className="text-sm text-[#00838F] animate-pulse">Loading...</p>
        )}
        {!hasMore && !loading && (
          <p className="text-gray-500 text-sm">No more blogs to load.</p>
        )}
      </div>

      {/* Login Prompt */}
      {showModal && (
        <LoginPromptModal
          onClose={() => setShowModal(false)}
          redirectPath={redirectPath}
        />
      )}
    </section>
  );
};

export default ExplorePublic;
