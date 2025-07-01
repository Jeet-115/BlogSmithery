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

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-post/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirm) return;

    try {
      await deletePostById(id);
      toast.success("Post deleted");
      // Remove the deleted post from the local state
      setRecentPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete post");
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
        {activeTab === "overview" && stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard label="Total Blogs" value={stats.total} />
              <StatCard label="Published" value={stats.published} />
              <StatCard label="Drafts" value={stats.draft} />
              <StatCard label="Total Views" value={stats.views} />
              <StatCard label="Total Likes" value={stats.likes} />
            </div>

            <h3 className="text-lg font-semibold mb-2 text-[#37474F]">
              Recent Posts
            </h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border p-4 rounded shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium text-lg">{post.title}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()} •{" "}
                      {post.status} • {post.views || 0} views •{" "}
                      {post.likes?.length || 0} likes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-sm bg-gray-200 px-3 py-1 rounded"
                      onClick={() => handleEdit(post._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
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
                    <button
                      className="text-sm bg-gray-200 px-3 py-1 rounded"
                      onClick={() => handleEdit(post._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(post._id)}
                    >
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
          <>
            <div className="flex justify-end mb-4">
              <button
                className="bg-[#00838F] text-white px-4 py-1 rounded"
                onClick={() =>
                  exportSectionToPDF("activity-section", "activity-report.pdf")
                }
              >
                📄 Export as PDF
              </button>
              <button
                className="bg-green-600 text-white px-4 py-1 rounded"
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
            </div>
            <div id="activity-section" className="space-y-8">
              {/* Top Blogs */}
              <section>
                <h3 className="font-semibold text-lg mb-2">
                  🔥 Top Performing Blogs
                </h3>
                <ul className="space-y-2">
                  {topBlogs.map((post) => (
                    <li key={post._id} className="border p-3 rounded shadow-sm">
                      <strong>{post.title}</strong> • {post.views} views •{" "}
                      {post.likes.length} likes
                    </li>
                  ))}
                </ul>
              </section>

              {/* Category Distribution */}
              <section>
                <h3 className="font-semibold text-lg mb-2">
                  📊 Category Distribution
                </h3>
                <ul className="grid grid-cols-2 gap-3">
                  {categoryStats.map(({ _id, count }) => (
                    <li
                      key={_id}
                      className="bg-gray-100 px-4 py-2 rounded shadow-sm"
                    >
                      {`${_id}: ${count}`}
                    </li>
                  ))}
                </ul>
                {categoryStats.length > 0 && (
                  <div className="max-w-[300px] mx-auto mt-4">
                    <CategoryPieChart data={categoryStats} />
                  </div>
                )}
              </section>

              {/* Publishing Trends */}
              <section>
                <h3 className="font-semibold text-lg mb-2">
                  📈 Publishing Trends
                </h3>
                <ul className="space-y-1">
                  {trends.map(({ month, count }, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      {month}: {count} posts
                    </li>
                  ))}
                </ul>
                {trends.length > 0 && (
                  <div className="max-w-[500px] mx-auto mt-4">
                    <TrendsLineChart data={trends} />
                  </div>
                )}
              </section>

              {/* Stale Drafts */}
              <section>
                <h3 className="font-semibold text-lg mb-2">
                  🕰️ Drafts Needing Attention
                </h3>
                <ul className="space-y-1">
                  {staleDrafts.map((d) => (
                    <li key={d._id} className="text-sm text-red-500">
                      {d.title}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Word Stats */}
              <section>
                <h3 className="font-semibold text-lg mb-2">✍️ Word Stats</h3>
                {wordStats && (
                  <ul className="text-sm text-gray-700">
                    <li>Total Words: {wordStats.totalWords}</li>
                    <li>
                      Average Words/Post:{" "}
                      {typeof wordStats.avgWords === "number"
                        ? wordStats.avgWords.toFixed(0)
                        : "N/A"}
                    </li>
                  </ul>
                )}
                {wordStats && (
                  <div className="max-w-[500px] mx-auto mt-4">
                    <WordStatsBarChart stats={wordStats} />
                  </div>
                )}
              </section>

              {/* Recently Liked Posts */}
              <section>
                <h3 className="font-semibold text-lg mb-2">
                  ❤️ Recently Liked Posts
                </h3>
                <ul className="space-y-1">
                  {likedPosts.map((p) => (
                    <li key={p._id} className="text-sm text-blue-700">
                      {p.title}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Milestones */}
              <section>
                <h3 className="font-semibold text-lg mb-2">🎯 Milestones</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  {Object.entries(milestones)
                    .filter(([_, v]) => v)
                    .map(([key], idx) => (
                      <li key={idx}>
                        {key === "has10Posts"
                          ? "🎉 You've published 10+ blogs!"
                          : key === "has100Likes"
                          ? "💯 You've earned 100+ likes!"
                          : key}
                      </li>
                    ))}
                </ul>
              </section>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default DashboardHome;
