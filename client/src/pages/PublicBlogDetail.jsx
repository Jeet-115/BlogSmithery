import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById } from "../services/postService";
import LoginPromptModal from "../components/LoginPromptModal";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PublicBlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostById(id);
      setPost(data);
    };
    fetchPost();
  }, [id]);

  const triggerLoginModal = (target = `/dashboard/blog/${id}`) => {
    setRedirectPath(target);
    setShowModal(true);
  };

  if (!post)
    return (
      <p className="text-center py-10 text-[#37474F] text-lg">Loading...</p>
    );

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/explore")}
        className="mb-4 flex items-center text-[#00838F] hover:text-[#006064] transition-colors text-sm font-medium bg-white/80 px-4 py-2 rounded-full shadow border border-[#B0BEC5]"
      >
        <span className="mr-2 text-lg">←</span> Back to Home
      </motion.button>
      {/* Title & Meta */}
      <motion.div
        className="mb-6 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl font-bold text-[#1C2B33]">{post.title}</h1>
        <p className="text-sm text-[#546E7A]">
          by{" "}
          <span className="font-medium">{post.author?.name || "Unknown"}</span>{" "}
          • {new Date(post.createdAt).toLocaleDateString()} • {post.category}
        </p>
      </motion.div>

      {/* Cover Image */}
      {post.coverImage && (
        <motion.img
          src={post.coverImage}
          alt="cover"
          className="w-full h-auto object-cover rounded-2xl shadow-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        />
      )}

      {/* Blog Content */}
      <motion.div
        className="prose prose-lg max-w-none bg-white/80 backdrop-blur border border-[#B0BEC5] rounded-xl p-6 shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      />

      {/* Like & Comment Buttons */}
      <motion.div
        className="mt-6 flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => triggerLoginModal()}
          className="px-5 py-2 rounded-full flex items-center gap-2 text-sm font-semibold bg-gray-200 text-[#1C2B33] hover:bg-gray-300 transition"
        >
          <FaHeart className="text-base" />
          Like ({post.likes?.length || 0})
        </button>
        <button
          onClick={() => triggerLoginModal()}
          className="px-5 py-2 rounded-full text-sm font-semibold text-[#00838F] bg-white border border-[#90A4AE] hover:bg-[#E0F7FA] transition"
        >
          💬 Comment
        </button>
      </motion.div>

      {/* Comment Prompt */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <div
          onClick={() => triggerLoginModal()}
          className="text-center text-[#546E7A] italic cursor-pointer hover:underline"
        >
          Login to view and add comments
        </div>
      </motion.div>

      {/* Author Section */}
      <motion.div
        className="mt-12 border-t border-[#B0BEC5] pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h4 className="text-xl font-semibold text-[#1C2B33] mb-3">
          About the Author
        </h4>
        <div className="p-5 bg-white/70 backdrop-blur shadow-md border border-[#B0BEC5] rounded-xl">
          <p className="font-medium text-[#37474F] text-lg">
            {post.author?.name || "Unknown"}
          </p>
          <p className="text-sm text-[#546E7A]">
            Joined on{" "}
            {post.author?.createdAt
              ? new Date(post.author.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : "Unknown"}
          </p>
        </div>
      </motion.div>

      {/* Login Modal */}
      {showModal && (
        <LoginPromptModal
          onClose={() => setShowModal(false)}
          redirectPath={redirectPath}
        />
      )}
    </motion.div>
  );
};

export default PublicBlogDetail;
