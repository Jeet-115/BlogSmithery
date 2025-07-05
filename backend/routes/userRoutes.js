import express from "express";
import { toggleFollowUser, getFollowersAndFollowing } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.patch("/follow/:id", protect, toggleFollowUser);
router.get("/followers-following", protect, getFollowersAndFollowing);

export default router;
