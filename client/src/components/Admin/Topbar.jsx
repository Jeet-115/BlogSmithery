import React from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Topbar = ({ user, handleLogout }) => {
  return (
    <motion.header
      className="w-full flex flex-col sm:flex-row justify-between items-center bg-white/70 backdrop-blur-md px-6 py-4 rounded-xl shadow-md mb-6 transition-all"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <FaUserCircle className="text-[#00838F] text-2xl" />
        <span className="text-[#2E3C43] font-semibold text-lg outfit">
          Welcome, {user?.name || "Guest"}
        </span>
      </div>

      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 sm:mt-0 bg-[#00838F] text-white px-5 py-2 rounded-lg shadow hover:bg-[#006064] transition-all font-medium flex items-center gap-2 outfit"
      >
        <FaSignOutAlt className="text-sm" />
        Logout
      </motion.button>
    </motion.header>
  );
};

export default Topbar;
