import Comment from "../models/commentmodel.js";
import Post from "../models/blogmodel.js";
import Notification from "../models/notificationModel.js";

export const createComment = async (req, res) => {
  try {
    const { postId, content, parentComment } = req.body;

    // Create the comment
    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      content,
      parentComment: parentComment || null,
    });

    // Get the post and its author
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Avoid notifying self-comments
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: "comment",
        post: post._id,
        message: `${req.user.name} commented on your post "${post.title}"`,
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Error adding comment" });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const post = await Post.findById(comment.post);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isPostAuthor = post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    // Cascade delete replies
    await Comment.deleteMany({ parentComment: commentId });

    // Delete the comment
    await comment.deleteOne();

    res.json({ message: "Comment and replies deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

