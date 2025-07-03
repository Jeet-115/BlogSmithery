import express from "express";
import { getPublicExplorePosts, getPrivateExplorePosts } from "../controllers/exploreController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/public", getPublicExplorePosts);
router.get("/private", protect, getPrivateExplorePosts);

export default router;
