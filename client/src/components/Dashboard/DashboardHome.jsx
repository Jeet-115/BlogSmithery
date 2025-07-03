import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getOverviewStats,
  getTopBlogs,
  getCategoryStats,
  getPublishingTrends,
  getStaleDrafts,
  getWordStats,
  getRecentlyLikedPosts,
  getMilestones,
} from "../../services/dashboardService";
import { exportSectionToPDF, exportCombinedCSV } from "../../utils/exportUtils";
import { CategoryPieChart } from "../../components/PieChart";
import { TrendsLineChart } from "../../components/LineChart";
import { WordStatsBarChart } from "../../components/BarChart";
import { deletePostById } from "../../services/postService"; // 👈 add this
import { toast } from "react-hot-toast"; // 👈 for notifications
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.05, duration: 0.4 },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

function DashboardHome() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [topBlogs, setTopBlogs] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [trends, setTrends] = useState([]);
  const [staleDrafts, setStaleDrafts] = useState([]);
  const [wordStats, setWordStats] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-post/${id}`);
  };

  const handleDelete = (id) => {
    setPostToDelete(id);
    setShowConfirmModal(true);
  };
  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      await deletePostById(postToDelete);
      toast.success("Post deleted");
      setRecentPosts((prev) => prev.filter((p) => p._id !== postToDelete));
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete post");
    } finally {
      setPostToDelete(null);
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [
          overview,
          top,
          categories,
          trend,
          drafts,
          words,
          liked,
          milestone,
        ] = await Promise.all([
          getOverviewStats(),
          getTopBlogs(),
          getCategoryStats(),
          getPublishingTrends(),
          getStaleDrafts(),
          getWordStats(),
          getRecentlyLikedPosts(),
          getMilestones(),
        ]);

        setStats(overview.stats);
        setRecentPosts(overview.recentPosts);
        setTopBlogs(top);
        setCategoryStats(categories);
        setTrends(trend);
        setStaleDrafts(drafts);
        setWordStats(words);
        setLikedPosts(liked);
        setMilestones(milestone);
      } catch (err) {
        console.error("Failed to load dashboard analytics", err);
      }
    };

    fetchAllStats();
  }, []);

  const filteredPosts =
    filter === "all"
      ? recentPosts
      : recentPosts.filter((p) => p.status === filter);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeUp}
        className="p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur border border-[#B0BEC5] rounded-3xl shadow-xl w-full max-w-6xl mx-auto transition-all"
      >
        {/* Welcome Heading */}
        <motion.h1
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1C2B33] mb-2 outfit"
          variants={fadeUp}
          custom={1}
        >
          Welcome back, {user?.name || "User"} 🌞
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base md:text-lg text-[#546E7A] mb-6"
          variants={fadeUp}
          custom={2}
        >
          This is your spiritual space to reflect, create and track your writing
          journey.
        </motion.p>

        {/* Tab Buttons */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          variants={fadeUp}
          custom={3}
        >
          {["overview", "myBlogs", "activity"].map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
                activeTab === key
                  ? "bg-[#00838F] text-white shadow-md"
                  : "bg-white/70 text-[#37474F] border border-[#CFD8DC]"
              }`}
            >
              {key === "overview"
                ? "📊 Overview"
                : key === "myBlogs"
                ? "📝 My Blogs"
                : "📁 Activity"}
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <>
            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {[
                { label: "Total Blogs", value: stats.total },
                { label: "Published", value: stats.published },
                { label: "Drafts", value: stats.draft },
                { label: "Total Views", value: stats.views },
                { label: "Total Likes", value: stats.likes },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  custom={i}
                  className="bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-2xl p-5 text-center shadow-md"
                >
                  <h4 className="text-[#00838F] text-2xl font-bold">
                    {item.value}
                  </h4>
                  <p className="text-sm text-[#37474F] mt-1">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Posts Heading */}
            <motion.h3
              className="text-lg font-semibold mb-4 text-[#1C2B33]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              🕮 Recent Posts
            </motion.h3>

            {/* Recent Posts List */}
            <motion.div
              className="space-y-5"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {recentPosts.length > 0 ? (
                recentPosts.map((post, i) => (
                  <motion.div
                    key={post._id}
                    className="bg-white/80 backdrop-blur border border-[#CFD8DC] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
                    variants={fadeUp}
                    custom={i}
                  >
                    <div>
                      <h4 className="font-semibold text-[#1C2B33] text-base sm:text-lg">
                        {post.title}
                      </h4>
                      <p className="text-sm text-[#607D8B] mt-1">
                        {new Date(post.createdAt).toLocaleDateString()} •{" "}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            post.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {post.status}
                        </span>{" "}
                        • {post.views || 0} views • {post.likes?.length || 0}{" "}
                        likes
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1.5 rounded-full transition"
                        onClick={() => handleEdit(post._id)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-full transition"
                        onClick={() => handleDelete(post._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center text-gray-500 italic mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  You haven't written any recent posts yet.
                </motion.div>
              )}
            </motion.div>
          </>
        )}

        {/* My Blogs Tab */}
        {activeTab === "myBlogs" && (
          <>
            {/* Filter Tabs */}
            <motion.div
              className="flex flex-wrap gap-3 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {["all", "published", "draft"].map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-5 py-2 rounded-full text-sm border font-medium transition ${
                    filter === key
                      ? "bg-[#00838F] text-white shadow-md"
                      : "bg-white/70 text-[#37474F] border-[#B0BEC5]"
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} (
                  {key === "all" ? stats.total : stats[key]})
                </button>
              ))}
            </motion.div>

            {/* Post List */}
            <motion.div
              className="space-y-5"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, i) => (
                  <motion.div
                    key={post._id}
                    className="bg-white/80 backdrop-blur border border-[#B0BEC5] rounded-2xl p-5 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    variants={fadeInUp}
                    custom={i}
                  >
                    {/* Post Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#1C2B33]">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#607D8B] mt-1">
                        {new Date(post.createdAt).toLocaleDateString()} •{" "}
                        {post.views || 0} views • {post.likes?.length || 0}{" "}
                        likes
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1.5 rounded-full transition"
                        onClick={() => handleEdit(post._id)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-full transition"
                        onClick={() => handleDelete(post._id)}
                      >
                        🗑️ Delete
                      </button>
                      <button
                        className="bg-[#00ACC1] hover:bg-[#00838F] text-white text-sm px-4 py-1.5 rounded-full transition"
                        onClick={() => navigate(`/dashboard/blog/${post._id}`)}
                      >
                        👁️ View
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center text-gray-500 italic mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  You haven't created any blogs yet.
                </motion.div>
              )}
            </motion.div>
          </>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <>
            {/* Export Buttons */}
            <motion.div
              className="flex flex-wrap justify-end gap-4 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="bg-[#00838F] hover:bg-[#006064] text-white px-5 py-2 rounded-full shadow-md transition"
                onClick={() =>
                  exportSectionToPDF("activity-section", "activity-report.pdf")
                }
              >
                📄 Export as PDF
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md transition"
                onClick={() =>
                  exportCombinedCSV(
                    [
                      { title: "Top Blogs", data: topBlogs },
                      { title: "Category Distribution", data: categoryStats },
                      { title: "Publishing Trends", data: trends },
                      { title: "Stale Drafts", data: staleDrafts },
                      {
                        title: "Word Stats",
                        data: wordStats ? [wordStats] : [],
                      },
                      { title: "Recently Liked Posts", data: likedPosts },
                      {
                        title: "Milestones",
                        data: milestones ? [milestones] : [],
                      },
                    ],
                    "activity-dashboard-report.csv"
                  )
                }
              >
                📋 Export Combined CSV
              </button>
            </motion.div>

            {/* Main Section */}
            <motion.div
              id="activity-section"
              className="space-y-10 bg-white/60 backdrop-blur rounded-3xl p-6 border border-[#B0BEC5] shadow-lg"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              {/* Sections with animation */}
              {[
                {
                  title: "🔥 Top Performing Blogs",
                  content: topBlogs.length ? (
                    <ul className="space-y-3">
                      {topBlogs.map((post, i) => (
                        <motion.li
                          key={post._id}
                          className="bg-white border border-[#B0BEC5] rounded-xl p-4 shadow-sm"
                          variants={fadeInUp}
                          custom={i}
                        >
                          <div className="text-[#00838F] font-medium">
                            {post.title}
                          </div>
                          <div className="text-sm text-[#37474F]">
                            {post.views} views • {post.likes.length} likes
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No top blogs yet.
                    </p>
                  ),
                },
                {
                  title: "📊 Category Distribution",
                  content: categoryStats.length ? (
                    <>
                      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categoryStats.map(({ _id, count }, i) => (
                          <motion.li
                            key={_id}
                            className="bg-[#E0F2F1] px-4 py-2 rounded-lg text-sm text-[#37474F] shadow-sm"
                            variants={fadeInUp}
                            custom={i}
                          >
                            {_id}: {count}
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div
                        className="max-w-xs mx-auto mt-5"
                        variants={fadeInUp}
                        custom={3}
                      >
                        <CategoryPieChart data={categoryStats} />
                      </motion.div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No category data available.
                    </p>
                  ),
                },
                {
                  title: "📈 Publishing Trends",
                  content: trends.length ? (
                    <>
                      <ul className="text-sm text-[#37474F] space-y-1">
                        {trends.map(({ month, count }, i) => (
                          <motion.li key={i} variants={fadeInUp} custom={i}>
                            {month}: {count} posts
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div
                        className="max-w-lg mx-auto mt-5"
                        variants={fadeInUp}
                        custom={3}
                      >
                        <TrendsLineChart data={trends} />
                      </motion.div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No publishing trend data.
                    </p>
                  ),
                },
                {
                  title: "🕰️ Drafts Needing Attention",
                  content: staleDrafts.length ? (
                    <ul className="text-sm text-red-600 space-y-1">
                      {staleDrafts.map((d, i) => (
                        <motion.li key={d._id} variants={fadeInUp} custom={i}>
                          ❗ {d.title}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      All drafts are fresh!
                    </p>
                  ),
                },
                {
                  title: "✍️ Word Stats",
                  content: wordStats ? (
                    <>
                      <ul className="text-sm text-[#37474F]">
                        <li>Total Words: {wordStats.totalWords}</li>
                        <li>
                          Avg. Words/Post:{" "}
                          {typeof wordStats.avgWords === "number"
                            ? wordStats.avgWords.toFixed(0)
                            : "N/A"}
                        </li>
                      </ul>
                      <motion.div
                        className="max-w-lg mx-auto mt-5"
                        variants={fadeInUp}
                        custom={1}
                      >
                        <WordStatsBarChart stats={wordStats} />
                      </motion.div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No word stats found.
                    </p>
                  ),
                },
                {
                  title: "❤️ Recently Liked Posts",
                  content: likedPosts.length ? (
                    <ul className="text-sm text-blue-700 space-y-1">
                      {likedPosts.map((p, i) => (
                        <motion.li key={p._id} variants={fadeInUp} custom={i}>
                          👍 {p.title}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No recent likes yet.
                    </p>
                  ),
                },
                {
                  title: "🎯 Milestones",
                  content:
                    milestones && Object.values(milestones).some(Boolean) ? (
                      <ul className="text-sm text-green-700 space-y-1">
                        {Object.entries(milestones)
                          .filter(([_, v]) => v)
                          .map(([key], idx) => (
                            <motion.li
                              key={idx}
                              variants={fadeInUp}
                              custom={idx}
                            >
                              {key === "has10Posts"
                                ? "🎉 You've published 10+ blogs!"
                                : key === "has100Likes"
                                ? "💯 You've earned 100+ likes!"
                                : `🏁 ${key}`}
                            </motion.li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        You're getting close to new achievements!
                      </p>
                    ),
                },
              ].map((section, i) => (
                <motion.section key={i} variants={fadeInUp} custom={i}>
                  <h3 className="text-xl font-semibold text-[#1C2B33] mb-3">
                    {section.title}
                  </h3>
                  {section.content}
                </motion.section>
              ))}
            </motion.div>
          </>
        )}

        <ConfirmModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
          title="Delete this post?"
          message="This action cannot be undone. Are you sure you want to delete this blog post?"
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default DashboardHome;
