import Comment from '../models/commentmodel.js';

export const createComment = async (req, res) => {
  try {
    const { postId, content, parentComment } = req.body;
    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      content,
      parentComment: parentComment || null,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
};
