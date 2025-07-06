import { useEffect, useState } from "react";
import {
  getUserById,
  deleteUserPostByAdmin,
} from "../../services/adminUserService";
import { toast } from "react-hot-toast";
import AdminPostModeration from "./AdminPostModeration";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";
import { MdDelete, MdVisibility } from "react-icons/md";

const AdminUserProfileTab = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetPostId, setTargetPostId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(userId);
      setUser(data);
    };
    if (userId) fetchUser();
  }, [userId]);

  const handlePromptDelete = (postId) => {
    setTargetPostId(postId);
    setShowConfirm(true);
  };

  const confirmDeletePost = async () => {
    try {
      await deleteUserPostByAdmin(targetPostId);
      toast.success("Post deleted");
      setUser((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p._id !== targetPostId),
      }));
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  if (!user) return null;

  return (
    <motion.div
      className="mt-8 p-4 md:p-6 bg-white/90 backdrop-blur rounded-2xl border border-[#CFD8DC] shadow-xl space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {user.user.profileImage ? (
          <img
            src={user.user.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#B0BEC5] flex items-center justify-center text-2xl font-semibold text-white">
            {user.user.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold text-[#1C2B33]">{user.user.name}</h3>
          <p className="text-sm text-[#546E7A]">{user.user.email}</p>
          <p className="text-sm mt-1">
            <strong>Role:</strong> {user.user.role}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#37474F]">
        <p>
          <strong>Location:</strong> {user.user.location || "—"}
        </p>
        <p>
          <strong>Bio:</strong> {user.user.bio || "—"}
        </p>
        <p>
          <strong>Website:</strong> {user.user.website || "—"}
        </p>
        <p>
          <strong>Comments:</strong> {user.commentCount}
        </p>
        <p>
          <strong>Followers:</strong> {user.user.followers?.length || 0}
        </p>
        <p>
          <strong>Following:</strong> {user.user.following?.length || 0}
        </p>
      </div>

      {/* Social Links */}
      {user.user.socialLinks && (
        <div>
          <h4 className="font-semibold text-[#1C2B33] mb-1">🔗 Social Links</h4>
          <ul className="list-disc list-inside text-sm text-[#37474F] space-y-1">
            {user.user.socialLinks.twitter && (
              <li>
                <a
                  href={user.user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Twitter
                </a>
              </li>
            )}
            {user.user.socialLinks.github && (
              <li>
                <a
                  href={user.user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:underline"
                >
                  GitHub
                </a>
              </li>
            )}
            {user.user.socialLinks.linkedin && (
              <li>
                <a
                  href={user.user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* User Posts */}
      <div>
        <h4 className="font-semibold text-lg text-[#1C2B33] mb-2">📝 Posts by User</h4>
        {user.posts.length === 0 ? (
          <p className="text-sm text-gray-500">No posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {user.posts.map((post) => (
              <motion.li
                key={post._id}
                className="bg-white/80 rounded-xl border p-4 shadow transition hover:shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#00838F]">{post.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {post.category} • {post.status} • {post.views} views •{" "}
                      {post.likes?.length} likes
                    </p>
                  </div>
                  <div className="flex gap-2 text-xl text-[#37474F]">
                    <button
                      onClick={() => setSelectedPostId(post._id)}
                      title="View"
                      className="hover:text-[#006064] transition"
                    >
                      <MdVisibility />
                    </button>
                    <button
                      onClick={() => handlePromptDelete(post._id)}
                      title="Delete"
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>

                {/* Moderation Section */}
                <AnimatePresence>
                  {selectedPostId === post._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <AdminPostModeration
                        postId={post._id}
                        onClose={() => setSelectedPostId(null)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDeletePost}
        title="Delete this post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </motion.div>
  );
};

export default AdminUserProfileTab;
