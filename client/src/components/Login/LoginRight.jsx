import { motion } from "framer-motion";

const LoginRight = () => {
  return (
    <motion.div
      className="bg-white/60 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border border-[#B0BEC5]"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-[#1C2B33] mb-4 outfit">
        Log in to Your Blog Smithery Account
      </h2>
      <p className="text-[#37474F] text-sm md:text-base mb-6 leading-relaxed">
        Access your personalized blogging dashboard. Write posts, explore
        community content, and enhance your creativity with AI writing tools.
      </p>

      <motion.img
        src="/loginregister.png"
        alt="Blogging Illustration"
        className="rounded-2xl shadow-md w-full h-auto max-h-[300px] object-cover"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default LoginRight;
