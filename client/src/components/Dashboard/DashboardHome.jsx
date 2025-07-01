import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { getUserPosts } from "../services/postService";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const StatCard = ({ label, value }) => (
  <div className="bg-white border rounded-xl shadow p-4 text-center">
    <p className="text-2xl font-bold text-[#00838F]">{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

function DashboardHome() {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load user posts", err);
      }
    };
    fetchPosts();
  }, []);

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    views: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    likes: posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0),
  };

  const filteredPosts =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeUp}
        className="p-4 sm:p-6 md:p-8 bg-white/80 rounded-2xl shadow-md w-full"
      >
        <motion.h1
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E3C43] mb-4 outfit"
          variants={fadeUp}
          custom={1}
        >
          Welcome {user?.name}
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base md:text-lg text-[#546E7A] mb-6"
          variants={fadeUp}
          custom={2}
        >
          This is your dashboard. Have a great day!
        </motion.p>

        {/* Tab Selector */}
        <div className="flex gap-4 mb-6">
          {["overview", "myBlogs", "activity"].map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === key
                  ? "bg-[#00838F] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {key === "overview"
                ? "Overview"
                : key === "myBlogs"
                ? "My Blogs"
                : "Activity"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <StatCard label="Total Blogs" value={stats.total} />
            <StatCard label="Published" value={stats.published} />
            <StatCard label="Drafts" value={stats.draft} />
            <StatCard label="Total Views" value={stats.views} />
            <StatCard label="Total Likes" value={stats.likes} />
          </div>
        )}

        {/* My Blogs Tab */}
        {activeTab === "myBlogs" && (
          <>
            <div className="flex gap-3 mb-4">
              {["all", "published", "draft"].map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1 rounded-full text-sm border ${
                    filter === key
                      ? "bg-[#00838F] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} (
                  {key === "all" ? stats.total : stats[key]})
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border rounded p-4 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()} •{" "}
                      {post.views || 0} views • {post.likes?.length || 0} likes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm bg-gray-200 px-3 py-1 rounded">
                      Edit
                    </button>
                    <button className="text-sm bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="text-center text-gray-500 py-12">
            <p className="text-sm">Recent activity tracking coming soon...</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default DashboardHome;
