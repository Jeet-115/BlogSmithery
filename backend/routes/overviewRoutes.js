import express from 'express';
import { getUserOverview, getTopBlogs, getCategoryStats, getPublishingTrends, getStaleDrafts, getWordStats, getRecentlyLikedPosts, getMilestones } from '../controllers/overviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();


// Post routes
router.get('/me/overview', protect, getUserOverview);
router.get('/me/top-blogs', protect, getTopBlogs);
router.get('/me/category-stats', protect, getCategoryStats);
router.get('/me/trends', protect, getPublishingTrends);
router.get('/me/stale-drafts', protect, getStaleDrafts);
router.get('/me/word-stats', protect, getWordStats);
router.get('/me/liked-posts', protect, getRecentlyLikedPosts);
router.get('/me/milestones', protect, getMilestones);


export default router;
