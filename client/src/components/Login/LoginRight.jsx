import React from "react";

const LoginRight = () => {
  return (
    <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
      <h2 className="text-2xl font-semibold text-[#1C2B33] mb-4 outfit">
        Log in to Your Blogsmithery Account
      </h2>
      <p className="text-[#37474F] mb-6">
        Access your personalized blogging dashboard. Write posts, explore
        community content, and enhance your creativity with AI writing
        assistance.
      </p>

      <img
        src="./loginregister.png"
        alt="Excel Analysis Preview"
        className="rounded-xl shadow-md h-[300px] w-full"
      />
    </div>
  );
};

export default LoginRight;
