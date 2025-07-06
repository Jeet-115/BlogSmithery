import User from "../models/User.js";
import Post from "../models/blogmodel.js";
import Comment from "../models/commentmodel.js";
import Notification from "../models/notificationModel.js";
import { notifyUser } from "../utils/notifyUser.js";

// GET all users (with optional search/filter)
export const getAllUsers = async (req, res) => {
  try {
    const { search = "", role, status } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select("-password");

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// UPDATE user role/status/info
export const updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// DELETE user (hard delete)
export const deleteUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all posts by user
    const userPosts = await Post.find({ author: userId });
    const postIds = userPosts.map((p) => p._id);
    await Post.deleteMany({ author: userId });

    // Delete all comments on user's posts
    await Comment.deleteMany({ post: { $in: postIds } });

    // Delete all comments made by user
    await Comment.deleteMany({ user: userId });

    res.json({ message: "User, posts, and comments deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res
      .status(500)
      .json({ message: "Failed to delete user and associated data" });
  }
};

// GET single user with full profile
export const getUserDetailsByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .select("title category createdAt status views likes");

    const commentCount = await Comment.countDocuments({ user: user._id });

    res.json({ user, posts, commentCount });
  } catch (err) {
    console.error("Error getting user profile:", err);
    res.status(500).json({ message: "Failed to get user profile" });
  }
};

export const deletePostByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const authorId = post.author;
    const postTitle = post.title;

    // Delete the post and its comments
    await Post.findByIdAndDelete(post._id);
    await Comment.deleteMany({ post: post._id });

    // Send notification to the post author
    await notifyUser({
      recipient: authorId,
      type: "admin_post_deleted",
      message: `Your post "${postTitle}" was deleted by an admin.`,
    });

    res.json({ message: "Post and related comments deleted successfully" });
  } catch (err) {
    console.error("Admin delete post error:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const deleteCommentByAdmin = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate("post", "title author")
      .populate("user", "_id");

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const commentAuthor = comment.user;
    const post = comment.post;

    // Delete replies
    await Comment.deleteMany({ parentComment: comment._id });

    await comment.deleteOne();

    // Notify the comment author
    await notifyUser({
      recipient: commentAuthor._id,
      type: "admin_comment_deleted",
      message: `Your comment on "${post.title}" was deleted by an admin.`,
      post: post._id,
    });

    // Notify post author (if different)
    if (commentAuthor._id.toString() !== post.author.toString()) {
      await notifyUser({
        recipient: post.author,
        type: "admin_deleted_comment_on_post",
        message: `A comment on your post "${post.title}" was deleted by an admin.`,
        post: post._id,
      });
    }

    res.json({ message: "Comment and replies deleted by admin" });
  } catch (err) {
    console.error("Admin delete comment error:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

export const getCommentsForPostByAdmin = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate("user", "name")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error("Admin fetch comments error:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const getFullPostDetailsByAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "name email")
      .lean();

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ post: post._id })
      .populate("user", "name")
      .sort({ createdAt: 1 });

    res.json({ post, comments });
  } catch (err) {
    console.error("Admin full post fetch error:", err);
    res.status(500).json({ message: "Failed to fetch post details" });
  }
};

export const banUser = async (req, res) => {
  const { id } = req.params;
  const { bannedUntil, reason } = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.ban = {
    isBanned: true,
    bannedUntil: new Date(bannedUntil),
    reason,
  };
  await notifyUser({
    recipient: user._id,
    type: "ban_notice",
    message: `You have been banned until ${new Date(
      bannedUntil
    ).toLocaleString()}. Reason: ${reason}`,
  });
  await user.save();
  res.json({ message: "User banned successfully" });
};

export const unbanUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.ban = {
    isBanned: false,
    bannedUntil: null,
    reason: "",
  };
  await notifyUser({
    recipient: user._id,
    type: "unban_notice",
    message: `Your account ban has been lifted. You may now post, like, and comment.`,
  });
  await user.save();
  res.json({ message: "User unbanned successfully" });
};
