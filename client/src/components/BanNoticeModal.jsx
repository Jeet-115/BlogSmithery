import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const BanNoticeModal = ({ ban, onClose }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!ban?.bannedUntil) return;

    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(ban.bannedUntil);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Unbanned");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [ban?.bannedUntil]);

  return (
    <AnimatePresence>
      {ban?.isBanned && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur border border-[#B0BEC5] rounded-2xl shadow-xl w-full max-w-md p-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-3 flex items-center gap-2">
              🚫 You are Banned
            </h2>

            <div className="space-y-2 text-sm text-[#37474F]">
              <p>
                <strong>Reason:</strong>{" "}
                {ban.reason || "No reason provided"}
              </p>
              <p>
                <strong>Banned Until:</strong>{" "}
                {new Date(ban.bannedUntil).toLocaleString()}
              </p>
              <p>
                <strong>Time Remaining:</strong>{" "}
                <span className="font-semibold text-[#1C2B33]">
                  {timeLeft}
                </span>
              </p>
            </div>

            <div className="mt-6 text-end">
              <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BanNoticeModal;
