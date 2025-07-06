import { useEffect, useState } from "react";
import { getFullPostById, deleteUserCommentByAdmin } from "../../services/adminUserService";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { MdDelete, MdVisibility } from "react-icons/md";
import ConfirmModal from "../../components/ConfirmModal";

const AdminPostModeration = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [flatComments, setFlatComments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetCommentId, setTargetCommentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getFullPostById(postId);
        setPost(data.post);
        setFlatComments(data.comments);
        setComments(buildCommentTree(data.comments));
      } catch (err) {
        console.error("Failed to load post", err);
      }
    };
    fetchPost();
  }, [postId]);

  const buildCommentTree = (flatComments) => {
    const map = {};
    const roots = [];

    flatComments.forEach((comment) => {
      comment.replies = [];
      map[comment._id] = comment;
    });

    flatComments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = map[comment.parentComment];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        roots.push(comment);
      }
    });

    return roots;
  };

  const promptDeleteComment = (id) => {
    setTargetCommentId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUserCommentByAdmin(targetCommentId);
      toast.success("Comment deleted");

      const data = await getFullPostById(postId);
      setFlatComments(data.comments);
      setComments(buildCommentTree(data.comments));
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const renderComments = (commentList, depth = 0, parentAuthor = null) =>
    commentList
      .filter((c) => c.content.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((c) => (
        <motion.li
          key={c._id}
          className={`border p-3 rounded-xl bg-white/80 shadow-sm mb-3 ml-${depth * 4}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: depth * 0.05 }}
        >
          <p className="text-sm text-[#1C2B33]">{c.content}</p>

          {depth > 0 && parentAuthor && (
            <p className="text-xs text-[#00838F] italic mt-1">
              ↪️ Reply to: <span className="font-medium">{parentAuthor}</span>
            </p>
          )}

          <div className="text-xs text-gray-500 flex justify-between items-center mt-2">
            <span>
              By:{" "}
              <span className="text-[#455A64] font-medium">{c.user?.name || "Unknown"}</span> •{" "}
              {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
            </span>
            <div className="flex items-center gap-3">
              <button
                className="text-[#00838F] hover:text-[#006064] transition"
                title="View"
              >
                <MdVisibility size={18} />
              </button>
              <button
                onClick={() => promptDeleteComment(c._id)}
                className="text-red-500 hover:text-red-700 transition"
                title="Delete"
              >
                <MdDelete size={18} />
              </button>
            </div>
          </div>

          {c.replies?.length > 0 && (
            <p className="text-xs text-[#78909C] mt-1 ml-2">
              💬 {c.replies.length} repl{c.replies.length === 1 ? "y" : "ies"}
            </p>
          )}

          {expanded && c.replies && c.replies.length > 0 && (
            <ul className="mt-3 ml-4 border-l border-gray-300 pl-4">
              {renderComments(c.replies, depth + 1, c.user?.name)}
            </ul>
          )}
        </motion.li>
      ));

  if (!post) return null;

  return (
    <motion.div
      className="mt-6 p-4 md:p-6 bg-white/90 backdrop-blur rounded-2xl border border-[#CFD8DC] shadow-xl space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-[#1C2B33]">📄 Post Preview</h3>

      <h2 className="text-2xl font-semibold text-[#00838F]">{post.title}</h2>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt="Cover"
          className="w-full max-h-60 object-contain rounded-lg border border-[#ECEFF1]"
        />
      )}

      <p className="text-sm text-[#37474F]">
        📂 Category: <span className="font-medium">{post.category}</span>
      </p>

      <div
        className="prose prose-sm sm:prose max-w-none bg-white rounded-lg px-4 py-3 border border-[#ECEFF1]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="my-4 border-gray-300" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h4 className="font-semibold text-lg text-[#1C2B33]">
          🗨️ Comments ({flatComments.length})
        </h4>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search comments..."
            className="border border-[#B0BEC5] rounded-full px-4 py-1.5 text-sm outline-none w-full sm:w-64"
          />
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-sm bg-[#ECEFF1] hover:bg-[#CFD8DC] px-4 py-1.5 rounded-full text-[#37474F] transition"
          >
            {expanded ? "Collapse Replies" : "Expand Replies"}
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-3">{renderComments(comments)}</ul>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={onClose}
          className="text-sm font-medium bg-[#ECEFF1] hover:bg-[#CFD8DC] text-[#37474F] px-4 py-2 rounded-full transition"
        >
          Close
        </button>
      </div>

      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete this comment?"
        message="Are you sure you want to remove this comment and all its replies?"
      />
    </motion.div>
  );
};

export default AdminPostModeration;
