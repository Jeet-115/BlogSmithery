import User from "../models/User.js";
import Post from "../models/blogmodel.js";
import Comment from "../models/commentmodel.js";

export const getAdminOverview = async (req, res) => {
  try {
    // USERS
    const totalUsers = await User.countDocuments();
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt role");

    // POSTS
    const totalPosts = await Post.countDocuments();
    const totalDrafts = await Post.countDocuments({ status: "draft" });
    const totalPublished = await Post.countDocuments({ status: "published" });

    const allPosts = await Post.find({}, "likes views");
    const totalViews = allPosts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = allPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

    const topBlog = await Post.findOne({ status: "published" })
      .sort({ likes: -1 })
      .select("title likes views");

    // COMMENTS
    const totalComments = await Comment.countDocuments();

    // TOP AUTHORS
    const topAuthors = await Post.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$author",
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { totalLikes: -1, totalViews: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: 0,
          name: "$author.name",
          email: "$author.email",
          totalLikes: 1,
          totalViews: 1,
        },
      },
    ]);

    // CATEGORY DISTRIBUTION
    const categoryStats = await Post.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // PUBLISHING TRENDS (Last 12 Months)
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const trends = await Post.aggregate([
      {
        $match: {
          status: "published",
          createdAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // RESPONSE
    res.json({
      users: {
        total: totalUsers,
        recent: recentUsers,
      },
      posts: {
        total: totalPosts,
        published: totalPublished,
        draft: totalDrafts,
        views: totalViews,
        likes: totalLikes,
        top: topBlog,
        categoryStats,
      },
      comments: {
        total: totalComments,
      },
      topAuthors,
      trends,
    });
  } catch (err) {
    console.error("Admin overview error:", err);
    res.status(500).json({ message: "Failed to fetch admin overview" });
  }
};
