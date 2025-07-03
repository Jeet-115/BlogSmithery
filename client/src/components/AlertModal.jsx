import { motion, AnimatePresence } from "framer-motion";
import { IoAlertCircleOutline } from "react-icons/io5";

const AlertModal = ({
  open,
  onClose,
  title = "Alert",
  message = "",
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/80 backdrop-blur border border-[#B0BEC5] rounded-2xl p-6 w-full max-w-md shadow-lg text-[#1C2B33]"
            initial={{ scale: 0.8, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <IoAlertCircleOutline className="text-2xl text-[#00838F]" />
              <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <p className="text-sm text-[#37474F] mb-5">{message}</p>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-5 py-2 bg-[#00838F] hover:bg-[#006064] text-white text-sm rounded-full transition shadow"
              >
                OK
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;
