import { useEffect, useRef, useState } from "react";
import { getNotifications } from "../services/notificationService";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const [clickedOpen, setClickedOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    fetchNotifications();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setClickedOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (!clickedOpen) {
      clearTimeout(hoverTimeoutRef.current);
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!clickedOpen) {
      hoverTimeoutRef.current = setTimeout(() => setOpen(false), 200);
    }
  };

  const handleClick = () => {
    setClickedOpen(!clickedOpen);
    setOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Bell Icon */}
      <button onClick={handleClick} className="relative">
        <motion.div
          initial={false}
          animate={{
            scale: notifications.length > 0 ? 1.1 : 1,
            transition: { type: "spring", stiffness: 300, damping: 15 },
          }}
        >
          <FaBell className="text-[#00838F] text-xl" />
        </motion.div>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 sm:w-64 bg-white/90 backdrop-blur-lg border border-[#B0BEC5] rounded-2xl shadow-xl z-50 p-4"
          >
            <h4 className="font-semibold mb-3 text-[#1C2B33] text-sm">
              🔔 Notifications
            </h4>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity.</p>
            ) : (
              <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    className="text-sm text-[#37474F] border-b last:border-none pb-2"
                  >
                    <div className="font-medium">{n.message}</div>
                    <div className="text-xs text-[#90A4AE]">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
