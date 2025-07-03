import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserProfile, updateUserProfile } from "../controllers/profileController.js";

const upload = multer({ dest: "/tmp" });
const router = express.Router();

router.get("/", protect, getUserProfile);
router.put("/", protect, upload.single("profileImage"), updateUserProfile);

export default router;
