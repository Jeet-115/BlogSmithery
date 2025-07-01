import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import cloudinary from '../config/cloudinaryConfig.js';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Use /tmp for Render compatibility
const upload = multer({ dest: '/tmp' });

// Upload image to Cloudinary (cover image or in-editor)
router.post('/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blogsmithery-posts',
      transformation: [{ width: 1024, crop: 'limit' }],
    });

    await fs.unlink(req.file.path); // remove temp file
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Post routes
router.route('/').get(getAllPosts).post(protect, createPost);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/like').patch(protect, toggleLike);

export default router;
