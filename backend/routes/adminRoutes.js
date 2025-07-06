import express from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import {
  getAdminOverview,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/overview', protect, adminOnly, getAdminOverview);

export default router;
