import React from "react";

const RegisterRight = () => {
  return (
    <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
      <h2 className="text-2xl font-semibold text-[#1C2B33] mb-4 outfit">
        Join Blogsmithery Today
      </h2>
      <p className="text-[#37474F] mb-6">
        Sign up to start creating beautiful blog posts, connect with the writing
        community, and get smart AI assistance to bring your ideas to life.
      </p>

      <img
        src="./loginregister.png"
        alt="Excel Analysis Preview"
        className="rounded-xl shadow-md h-[300px] w-full"
      />
    </div>
  );
};

export default RegisterRight;
