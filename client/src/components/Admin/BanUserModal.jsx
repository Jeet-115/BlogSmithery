import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const BanUserModal = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [bannedUntil, setBannedUntil] = useState("");

  const handleSubmit = () => {
    if (!bannedUntil || !reason.trim()) {
      toast.error("Please provide both reason and ban duration.");
      return;
    }

    onConfirm({ reason, bannedUntil });
    setReason("");
    setBannedUntil("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/80 border border-[#B0BEC5] backdrop-blur-lg rounded-2xl p-6 w-full max-w-md shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-[#1C2B33] mb-4 flex items-center gap-2">
              🚫 Ban User
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#37474F] mb-1">
                Reason
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Spamming, abusive behavior, etc."
                className="w-full border border-[#B0BEC5] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#00838F] text-sm"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#37474F] mb-1">
                Banned Until
              </label>
              <input
                type="datetime-local"
                value={bannedUntil}
                onChange={(e) => setBannedUntil(e.target.value)}
                className="w-full border border-[#B0BEC5] px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#00838F] text-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-sm font-medium rounded-full bg-[#ECEFF1] hover:bg-[#CFD8DC] text-[#37474F] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-1.5 text-sm font-semibold rounded-full bg-red-600 hover:bg-red-700 text-white transition"
              >
                Ban User
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BanUserModal;
