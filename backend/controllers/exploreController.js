import mongoose from "mongoose";
import Post from "../models/blogmodel.js";
import User from "../models/User.js";

// Public Explore - all published blogs
export const getPublicExplorePosts = async (req, res) => {
  try {
    const {
      search = "",
      category,
      sort = "recent",
      page = 1,
      limit = 10,
    } = req.query;

    const matchStage = {
      status: "published",
    };

    if (category) {
      matchStage.category = category;
    }

    const regex = new RegExp(search, "i");

    const searchConditions = [
      { title: { $regex: regex } },
      { tags: { $regex: regex } },
    ];

    // Using aggregation to join author data
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      { $unwind: "$authorInfo" },
      {
        $match: {
          $or: [...searchConditions, { "authorInfo.name": { $regex: regex } }],
        },
      },
      {
        $sort: sort === "popular" ? { likes: -1 } : { createdAt: -1 },
      },
      {
        $skip: (parseInt(page) - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          title: 1,
          tags: 1,
          category: 1,
          createdAt: 1,
          likes: 1,
          coverImage: 1,
          "author._id": "$authorInfo._id",
          "author.name": "$authorInfo.name",
        },
      },
    ];

    const posts = await Post.aggregate(pipeline);

    res.json(posts);
  } catch (err) {
    console.error("Error fetching public explore:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

export const getPrivateExplorePosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      search = "",
      category,
      sort = "recent",
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (page - 1) * limit;
    const sortBy =
      sort === "popular"
        ? { likes: -1 }
        : sort === "views"
        ? { views: -1 }
        : { createdAt: -1 };

    const currentUser = await User.findById(userId).select(
      "interests following"
    );
    const interests = currentUser.interests || [];
    const following = currentUser.following || [];

    // Base filter: not own posts, must be published
    const baseQuery = {
      status: "published",
      author: { $ne: userId },
    };

    // Add search filter
    if (search) {
      const matchedUsers = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const matchedAuthorIds = matchedUsers.map((u) => u._id);

      const orConditions = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];

      if (matchedAuthorIds.length > 0) {
        orConditions.push({ author: { $in: matchedAuthorIds } });
      }

      baseQuery.$or = orConditions;
    }

    if (category) {
      baseQuery.category = category;
    }

    // Build priority-based query
    const prioritizedQuery = {
      $and: [baseQuery],
      $or: [
        { category: { $in: interests } },
        { author: { $in: following } },
        {}, // fallback
      ],
    };

    const posts = await Post.find(prioritizedQuery)
      .populate("author", "name profileImage")
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.json(posts);
  } catch (err) {
    console.error("Error fetching private explore:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};
