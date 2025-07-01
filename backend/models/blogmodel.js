import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    imageGallery: [String], // if you want to store image URLs separately
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
