import Post from "../models/blogmodel.js";
import User from "../models/User.js";

export const getUserOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("followers following ban");

    // Calculate stats using MongoDB queries
    const [total, published, draft] = await Promise.all([
      Post.countDocuments({ author: userId }),
      Post.countDocuments({ author: userId, status: "published" }),
      Post.countDocuments({ author: userId, status: "draft" }),
    ]);

    const allPosts = await Post.find({ author: userId }, "views likes");
    const views = allPosts.reduce((sum, post) => sum + (post.views || 0), 0);
    const likes = allPosts.reduce(
      (sum, post) => sum + (post.likes?.length || 0),
      0
    );

    // Fetch recent 10 posts
    const recentPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title createdAt views likes status");

    res.json({
      stats: {
        total,
        published,
        draft,
        views,
        likes,
        followers: user.followers.length,
        following: user.following.length,
      },
      ban: user.ban,
      recentPosts,
    });
  } catch (err) {
    console.error("Error fetching user overview:", err);
    res.status(500).json({ message: "Error fetching overview" });
  }
};

export const getTopBlogs = async (req, res) => {
  try {
    const userId = req.user._id;

    const topBlogs = await Post.find({ author: userId, status: "published" })
      .sort({ views: -1 }) // or { likes: -1 }
      .limit(3)
      .select("title views likes createdAt");

    res.json(topBlogs);
  } catch (err) {
    console.error("Error fetching top blogs:", err);
    res.status(500).json({ message: "Failed to fetch top blogs" });
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const categoryStats = await Post.aggregate([
      { $match: { author: userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(categoryStats);
  } catch (err) {
    console.error("Error fetching category stats:", err);
    res.status(500).json({ message: "Failed to fetch category stats" });
  }
};

export const getPublishingTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await Post.aggregate([
      { $match: { author: userId, status: "published" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Error fetching publishing trends:", err);
    res.status(500).json({ message: "Failed to fetch trends" });
  }
};

export const getStaleDrafts = async (req, res) => {
  try {
    const userId = req.user._id;
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // 14 days ago

    const drafts = await Post.find({
      author: userId,
      status: "draft",
      updatedAt: { $lt: cutoff },
    })
      .sort({ updatedAt: 1 })
      .limit(5);

    res.json(drafts);
  } catch (err) {
    console.error("Error fetching stale drafts:", err);
    res.status(500).json({ message: "Failed to fetch stale drafts" });
  }
};

export const getWordStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ author: userId });

    const wordStats = posts.reduce(
      (acc, post) => {
        const wordCount = post.content
          .replace(/<[^>]+>/g, "")
          .split(/\s+/).length;
        acc.totalWords += wordCount;
        acc.totalPosts += 1;
        return acc;
      },
      { totalWords: 0, totalPosts: 0 }
    );

    res.json({
      ...wordStats,
      averageWords:
        wordStats.totalPosts > 0
          ? Math.round(wordStats.totalWords / wordStats.totalPosts)
          : 0,
    });
  } catch (err) {
    console.error("Error computing word stats:", err);
    res.status(500).json({ message: "Failed to fetch word stats" });
  }
};

export const getRecentlyLikedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({
      author: userId,
      status: "published",
      likes: { $exists: true, $not: { $size: 0 } },
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title updatedAt likes");

    res.json(posts);
  } catch (err) {
    console.error("Error fetching liked posts:", err);
    res.status(500).json({ message: "Failed to fetch liked posts" });
  }
};

export const getMilestones = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ author: userId });

    const totalLikes = posts.reduce(
      (sum, p) => sum + (p.likes?.length || 0),
      0
    );
    const totalPublished = posts.filter((p) => p.status === "published").length;

    const milestones = {
      has10Posts: totalPublished >= 10,
      has100Likes: totalLikes >= 100,
    };

    res.json(milestones);
  } catch (err) {
    console.error("Error fetching milestones:", err);
    res.status(500).json({ message: "Failed to fetch milestones" });
  }
};
