import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";
import { useEffect, useState } from "react";
import { fetchAdminOverview } from "../../services/adminService";
import AdminTrendsChart from "./AdminTrendsChart";
import PieChart from "./PieChart";
import TrendsLineChart from "./TrendsLineChart";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  const [overview, setOverview] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminOverview();
        setOverview(data);
      } catch (err) {
        console.error("Failed to load admin data", err);
      }
    };
    loadData();
  }, []);

  return (
    <motion.div
      className="p-4 sm:p-6 md:p-8 bg-[#E0E0E0] min-h-screen rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Welcome Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#007ea7] to-[#00c2cb] outfit">
            Welcome, {user?.name || "Admin"}!
          </h1>
          <p className="text-[#37474F] mt-2">
            Here's your personalized dashboard overview.
          </p>
        </div>
        <FaUserShield className="text-[#00ACC1] text-5xl drop-shadow" />
      </motion.div>

      {/* Stats Cards */}
      {overview && (
        <motion.div
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <StatCard label="Users" value={overview.users.total} />
          <StatCard label="Posts" value={overview.posts.total} />
          <StatCard label="Published" value={overview.posts.published} />
          <StatCard label="Drafts" value={overview.posts.draft} />
          <StatCard label="Comments" value={overview.comments.total} />
          <StatCard label="Total Views" value={overview.posts.views} />
          <StatCard label="Total Likes" value={overview.posts.likes} />
        </motion.div>
      )}

      {/* Top Authors */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-[#1C2B33]">
          🏆 Top Authors
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overview?.topAuthors.map((author, i) => (
            <motion.div
              key={i}
              className="bg-white/90 p-5 border border-[#CFD8DC] rounded-xl shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.03 }}
            >
              <h4 className="text-[#00838F] font-bold text-lg mb-1">
                {author.name}
              </h4>
              <p className="text-sm text-[#37474F]">{author.email}</p>
              <p className="text-sm text-gray-600 mt-1">
                👍 {author.totalLikes} • 👁️ {author.totalViews}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trends Chart */}
      {overview?.trends?.length > 0 && (
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AdminTrendsChart data={overview.trends} />
        </motion.div>
      )}

      {/* Top Blog */}
      {overview?.posts?.top && (
        <motion.div
          className="mt-8 p-4 bg-white/80 border border-[#CFD8DC] rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-lg text-[#1C2B33] mb-2">
            🔥 Top Blog
          </h3>
          <p className="text-[#00838F] font-bold">{overview.posts.top.title}</p>
          <p className="text-sm text-gray-600">
            {overview.posts.top.likes.length} likes •{" "}
            {overview.posts.top.views} views
          </p>
        </motion.div>
      )}

      {/* Pie + Line Charts */}
      {overview?.posts?.categoryStats && overview?.trends && (
        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <PieChart data={overview.posts.categoryStats} />
          <TrendsLineChart data={overview.trends} />
        </motion.div>
      )}

      {/* Recent Users */}
      {overview?.users?.recent?.length > 0 && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-[#1C2B33]">
            🆕 Recent Users
          </h3>
          <ul className="space-y-3">
            {overview.users.recent.map((u) => (
              <motion.li
                key={u._id}
                className="bg-white p-4 border border-[#CFD8DC] rounded-xl shadow-sm hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
              >
                <div className="font-medium text-[#37474F] text-base">
                  {u.name}
                </div>
                <div className="text-sm text-gray-500">
                  {u.email} •{" "}
                  {new Date(u.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

const StatCard = ({ label, value }) => (
  <motion.div
    className="bg-white p-5 rounded-xl border shadow text-center hover:shadow-md transition-all"
    whileHover={{ scale: 1.05 }}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    <h3 className="text-2xl font-bold text-[#00838F]">{value}</h3>
    <p className="text-sm text-[#37474F] mt-1">{label}</p>
  </motion.div>
);

export default AdminHome;
