import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <main className="flex flex-col md:flex-row items-center justify-between flex-1 px-6 lg:px-20 md:px-10">
      <motion.div
        className="md:w-1/2 space-y-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-4xl font-bold text-[#1C2B33] outfit">
          Welcome to Blogsmithery
        </h2>
        <p className="text-[#37474F] text-lg outfit">
          Create, explore, and share powerful blog posts with ease. Get
          AI-powered writing help, engage with others, and manage your content —
          all in one seamless platform.
        </p>

        <div className="flex space-x-4">
          <Link
            to="/login"
            className="bg-[#00838F] text-white px-6 py-2 rounded hover:bg-[#006064] transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#1C2B33] text-white px-6 py-2 rounded hover:bg-[#37474F] transition"
          >
            Register
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="md:w-1/2 mt-10 md:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <img
          src="/homeright.png"
          alt="blogSmithery Dashboard Preview"
          className="w-full max-w-md mx-auto"
        />
      </motion.div>
    </main>
  );
};

export default Hero;
