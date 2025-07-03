import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const LoginPromptModal = ({ onClose, redirectPath = "/" }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    sessionStorage.setItem("redirectAfterAuth", redirectPath);
    navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, {
      state: { redirectTo: redirectPath },
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md bg-white/90 backdrop-blur border border-[#B0BEC5] rounded-2xl shadow-xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#1C2B33]">
            🔐 Login Required
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition text-xl"
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-[#546E7A] mb-6 leading-relaxed">
          Please log in to like, comment, or interact with this blog post.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleRedirect}
          className="w-full bg-[#00838F] hover:bg-[#006064] text-white text-sm font-medium py-2 rounded-full shadow transition"
        >
          🚀 Go to Login
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginPromptModal;
