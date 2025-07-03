import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { FaReply, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import { deleteCommentById } from "../services/commentService";

const CommentSection = ({ postId, open, postAuthorId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!open) return;

    const fetchComments = async () => {
      const res = await axiosInstance.get(`/api/comments/${postId}`);
      setComments(res.data);
    };
    fetchComments();
  }, [postId, open]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    const res = await axiosInstance.post("/api/comments", {
      postId,
      content,
      parentComment: replyingTo,
    });

    const populatedComment = {
      ...res.data,
      user: {
        _id: user._id,
        name: user.name,
      },
    };

    setComments((prev) => [populatedComment, ...prev]);
    setContent("");
    setReplyingTo(null);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      await deleteCommentById(commentToDelete);
      setComments((prev) =>
        prev.filter(
          (c) =>
            c._id !== commentToDelete && c.parentComment !== commentToDelete
        )
      );
    } catch (err) {
      console.error("Error deleting comment", err);
    } finally {
      setCommentToDelete(null);
    }
  };

  const renderComments = (parentId = null) =>
    comments
      .filter((c) => c.parentComment === parentId)
      .map((c) => {
        const canDelete =
          user && (user._id === c.user._id || user._id === postAuthorId);

        return (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`mt-3 ${parentId ? "ml-6 border-l-2 border-dashed pl-4" : ""}`}
          >
            <div className="bg-white/80 backdrop-blur rounded-xl p-3 shadow-sm border border-[#B0BEC5] relative">
              <p className="text-sm font-semibold text-[#37474F]">{c.user.name}</p>
              <p className="text-sm text-[#455A64]">{c.content}</p>

              <div className="flex gap-4 mt-2 text-xs text-[#00838F]">
                <button
                  onClick={() => setReplyingTo(c._id)}
                  className={`hover:underline flex items-center gap-1 ${
                    replyingTo === c._id ? "font-semibold text-[#006064]" : ""
                  }`}
                >
                  <FaReply className="text-xs" /> Reply
                </button>

                {canDelete && (
                  <button
                    onClick={() => {
                      setCommentToDelete(c._id);
                      setShowConfirm(true);
                    }}
                    className="text-red-500 hover:underline flex items-center gap-1"
                  >
                    <FaTrash className="text-xs" /> Delete
                  </button>
                )}
              </div>
            </div>

            {renderComments(c._id)}
          </motion.div>
        );
      });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mt-4 bg-white/60 backdrop-blur rounded-2xl p-4 border border-[#B0BEC5] shadow-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              replyingTo ? "Replying to a comment..." : "Add a comment..."
            }
            className="w-full p-2 border border-[#B0BEC5] rounded-lg bg-white/70 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#00838F] resize-none"
            rows={2}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-[#00838F] hover:bg-[#006064] text-white text-sm px-4 py-1 rounded-full shadow transition"
          >
            {replyingTo ? "Reply" : "Comment"}
          </button>

          {/* Comments List */}
          <div className="mt-4 space-y-3">{renderComments()}</div>

          {/* Confirm Modal */}
          <ConfirmModal
            open={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={handleDelete}
            title="Delete Comment?"
            message="This will remove the comment and all its replies permanently."
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentSection;
