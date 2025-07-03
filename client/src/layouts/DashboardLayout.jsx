import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { logoutUser } from "../services/authService";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import NotificationDropdown from "../components/NotificationDropdown";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Explore", path: "/dashboard/explore" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Create", path: "/dashboard/create" },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen w-full bg-[#E0E0E0] text-[#1C2B33] font-outfit">
      {/* Topbar */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-white shadow px-6 py-4 flex items-center justify-between flex-wrap md:flex-nowrap sticky top-0 z-50"
      >
        {/* Left (Logo & Title) */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Blogsmithery" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-[#1C2B33]">Blogsmithery</h1>
        </div>

        {/* Center Nav - Desktop only */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-grow">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[#00838F] hover:bg-[#CFD8DC] ${
                location.pathname === item.path ? "bg-[#00838F] text-white" : ""
              }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Right (Notification, Profile, Hamburger) */}
        <div className="flex items-center gap-4">
          {/* 🔔 Notification */}
          <NotificationDropdown />

          {/* 👤 Profile */}
          <div
            onClick={() => navigate("/dashboard/profile")}
            className="cursor-pointer"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-[#00838F]"
              />
            ) : (
              <FaUserCircle size={24} className="text-[#00838F]" />
            )}
          </div>
          <button
            onClick={handleLogout}
            className="hidden md:inline-block bg-[#1C2B33] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#37474F] transition"
          >
            Logout
          </button>

          {/* ☰ Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-[#1C2B33]"
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Nav - Bottom Sheet Style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white px-6 py-4 shadow-md flex flex-col gap-3 z-40"
          >
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm font-medium px-4 py-2 rounded-lg transition-all hover:bg-[#CFD8DC] ${
                  location.pathname === item.path
                    ? "bg-[#00838F] text-white"
                    : ""
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 bg-[#1C2B33] text-white px-4 py-2 rounded hover:bg-[#37474F] text-sm font-medium transition"
            >
              Logout
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl p-6 shadow-md bg-white/80 backdrop-blur border border-[#B0BEC5] min-h-[300px]"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
