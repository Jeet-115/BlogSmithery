import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { logoutUser } from "../services/authService";
import { motion } from "framer-motion";
import Sidebar from "../components/Admin/Sidebar";
import Topbar from "../components/Admin/Topbar";

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-[#E0E0E0] flex flex-col md:flex-row overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Sidebar */}
      <motion.div
        className="w-full md:w-64  backdrop-blur-md shadow-xl z-20"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Sidebar />
      </motion.div>

      {/* Main content area */}
      <motion.div
        className="flex-1 p-4 md:p-8 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Topbar */}
        <motion.div
          className=""
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Topbar user={user} handleLogout={handleLogout} />
        </motion.div>

        {/* Page content */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 min-h-[300px] outfit text-[#1C2B33]"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminLayout;
