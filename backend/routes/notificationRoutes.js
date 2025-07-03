import express from "express";
import { getUserNotifications, deleteNotification } from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.delete("/:id", protect, deleteNotification);

export default router;