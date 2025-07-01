import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { logoutUser } from "../services/authService";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const navItems = [
  { label: "Explore", path: "/dashboard/explore" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Create", path: "/dashboard/create" },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
      <header className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Blogsmithery" className="h-8 w-8" />
          <h1 className="text-xl font-bold">Blogsmithery</h1>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm font-medium transition-all px-3 py-1 rounded-md hover:text-[#00838F] hover:bg-[#CFD8DC] ${
                location.pathname === item.path ? "bg-[#00838F] text-white" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <FaUserCircle size={24} className="text-[#00838F]" />
          <button
            onClick={handleLogout}
            className="bg-[#1C2B33] text-white px-4 py-2 rounded hover:bg-[#37474F] text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-10">
        <div className="rounded-xl p-6 shadow-md min-h-[300px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
