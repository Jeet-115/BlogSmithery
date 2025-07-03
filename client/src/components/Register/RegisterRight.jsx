import React from "react";
import { motion } from "framer-motion";

const RegisterRight = () => {
  return (
    <motion.div
      className="bg-white/60 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-md mx-auto text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-bold text-[#1C2B33] mb-4 outfit"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Join Blog Smithery Today
      </motion.h2>

      <motion.p
        className="text-[#37474F] text-sm md:text-base mb-6 px-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Sign up to start creating beautiful blog posts, connect with the writing
        community, and get smart AI assistance to bring your ideas to life.
      </motion.p>

      <motion.img
        src="/loginregister.png"
        alt="Blogging preview"
        className="rounded-xl shadow-lg h-[240px] sm:h-[280px] md:h-[300px] w-full object-cover"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
    </motion.div>
  );
};

export default RegisterRight;
