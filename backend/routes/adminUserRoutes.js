import express from "express";
import {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getUserDetailsByAdmin,
  deletePostByAdmin,
  deleteCommentByAdmin,
  getCommentsForPostByAdmin,
  getFullPostDetailsByAdmin,
  banUser,
  unbanUser,
} from "../controllers/adminUserController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly); // All routes protected

router.get("/posts/:postId/comments", getCommentsForPostByAdmin);
router.get("/posts/:postId/full", getFullPostDetailsByAdmin);
router.get("/", getAllUsers);
router.get("/:id", getUserDetailsByAdmin);
router.put("/:id", updateUserByAdmin);
router.delete("/:id", deleteUserByAdmin);
router.delete("/posts/:postId", deletePostByAdmin);
router.delete("/comments/:commentId", deleteCommentByAdmin);
router.put("/:id/ban", banUser);
router.put("/:id/unban", unbanUser);

export default router;
