import User from "../models/User.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs/promises";

// Get current user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    let { name, bio, location, website, socialLinks } = req.body;

    // Safely parse socialLinks if it's a string
    try {
      if (typeof socialLinks === "string") {
        socialLinks = JSON.parse(socialLinks);
      }
    } catch (err) {
      socialLinks = {};
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic fields
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.website = website || user.website;

    // Safely update social links
    user.socialLinks = {
      twitter: socialLinks.twitter || user.socialLinks?.twitter || "",
      linkedin: socialLinks.linkedin || user.socialLinks?.linkedin || "",
      github: socialLinks.github || user.socialLinks?.github || "",
    };

    // Handle profile image upload if new file is present
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogsmithery-profiles",
        transformation: [{ width: 512, height: 512, crop: "fill" }],
      });
      await fs.unlink(req.file.path); // clean up local file
      user.profileImage = upload.secure_url;
    }

    const updatedUser = await user.save();
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
