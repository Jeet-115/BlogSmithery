import User from "../models/User.js";
import Post from "../models/blogmodel.js";

export const getAuthorDetails = async (req, res) => {
  try {
    const authorId = req.params.id;
    const { category } = req.query;

    // Include all necessary user fields for frontend display
    const author = await User.findById(authorId).select(
      "name createdAt bio location website profileImage socialLinks"
    );

    if (!author) return res.status(404).json({ message: "Author not found" });

    const query = { author: authorId, status: "published" };
    if (category) query.category = category;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .select("title coverImage category createdAt tags likes views");

    res.json({ author, posts });
  } catch (err) {
    console.error("Error fetching author details:", err);
    res.status(500).json({ message: "Error fetching author details" });
  }
};
