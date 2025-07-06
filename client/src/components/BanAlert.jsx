import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BanAlert = ({ ban }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const isStillBanned =
    ban?.isBanned && new Date(ban.bannedUntil) > new Date();

  useEffect(() => {
    if (!isStillBanned) return;

    const updateCountdown = () => {
      const now = new Date();
      const unbanTime = new Date(ban.bannedUntil);
      const diff = unbanTime - now;

      if (diff <= 0) {
        setTimeLeft("Unbanned");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [ban?.bannedUntil, isStillBanned]);

  return (
    <AnimatePresence>
      {isStillBanned && (
        <motion.div
          className="bg-yellow-100/80 border border-yellow-400 text-yellow-900 px-4 py-4 rounded-2xl shadow backdrop-blur-md mb-6 max-w-3xl w-full mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-xl">⚠️</div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#1C2B33] mb-1">
                You are currently banned
              </h2>
              <p className="text-sm text-[#37474F]">
                <strong>Reason:</strong> {ban.reason || "No reason provided"}
                <br />
                <strong>Banned Until:</strong>{" "}
                {new Date(ban.bannedUntil).toLocaleString()}
                <br />
                <strong>Time Remaining:</strong>{" "}
                <span className="font-semibold">{timeLeft}</span>
                <br />
                You cannot post, like, or comment until the ban is lifted.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BanAlert;
