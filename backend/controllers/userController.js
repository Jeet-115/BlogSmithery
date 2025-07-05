import User from "../models/User.js";
import Notification from "../models/notificationModel.js";

export const toggleFollowUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const alreadyFollowing = currentUser.following.includes(targetUserId);

    if (alreadyFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: "follow",
      post: null, // No post involved
      message: `${currentUser.name} started following you.`,
    });

    await currentUser.save();
    await targetUser.save();

    res.json({ following: !alreadyFollowing });
  } catch (err) {
    console.error("Error toggling follow:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFollowersAndFollowing = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("followers", "name profileImage")
      .populate("following", "name profileImage");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    console.error("Error fetching followers/following:", err);
    res.status(500).json({ message: "Server error" });
  }
};
