import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-6 py-12 md:py-20 lg:px-20 md:px-10 bg-[#E0E0E0]">
      {/* Left Text Section */}
      <motion.div
        className="w-full md:w-1/2 space-y-6 text-center md:text-left"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1C2B33] outfit">
          Welcome to <span className="text-[#00838F]">Blog Smithery</span>
        </h1>

        <p className="text-[#37474F] text-lg max-w-xl mx-auto md:mx-0">
          Create, explore, and share powerful blog posts with ease. Get
          AI-powered writing help, engage with the community, and manage your content — 
          all in one seamless platform.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
          <Link
            to="/login"
            className="bg-[#00838F] hover:bg-[#006064] text-white px-6 py-2 rounded-md font-medium transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#1C2B33] hover:bg-[#37474F] text-white px-6 py-2 rounded-md font-medium transition"
          >
            Register
          </Link>
          <button
            onClick={() => navigate("/explore")}
            className="bg-white border border-[#90A4AE] text-[#00838F] hover:bg-[#E0F7FA] px-6 py-2 rounded-md font-medium transition"
          >
            Explore Blogs
          </button>
        </div>
      </motion.div>

      {/* Right Image Section */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <img
          src="/homeright.png"
          alt="Blogsmithery dashboard preview"
          className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-lg"
        />
      </motion.div>
    </main>
  );
};

export default Hero;
