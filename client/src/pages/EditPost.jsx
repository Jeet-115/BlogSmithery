import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPostById,
  updatePostById,
  uploadPostImage,
} from "../services/postService";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const categories = [
  "Personal & Lifestyle",
  "Business & Career",
  "Finance & Money",
  "Technology & Innovation",
  "Education & Learning",
  "Health & Wellness",
  "Travel & Culture",
  "Food & Drink",
  "Home & Living",
  "Art & Creativity",
  "Fashion & Beauty",
  "Entertainment & Pop Culture",
  "Sports & Fitness",
  "Politics & Society",
  "Science & Nature",
  "Philosophy & Spirituality",
  "DIY & How-To",
  "Family & Relationships",
  "Opinions & Commentary",
  "Hobbies & Niche Interests",
];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverWidth, setCoverWidth] = useState("100%");
  const [coverHeight, setCoverHeight] = useState("auto");
  const [category, setCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(id);
        setTitle(post.title);
        setTags(post.tags?.join(", ") || "");
        setContent(post.content);
        setCoverImage(post.coverImage);
        setCategory(post.category);
      } catch (err) {
        toast.error("Failed to load post data");
        console.error(err);
      }
    };

    fetchPost();
  }, [id]);

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { url } = await uploadPostImage(formData);
      setCoverImage(url);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (status) => {
    setLoading(true);
    try {
      await updatePostById(id, {
        title,
        tags: tags.split(",").map((t) => t.trim()),
        content,
        coverImage,
        category,
        status,
      });

      toast.success(
        status === "published" ? "Post updated & published" : "Draft updated"
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-10 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl border border-[#B0BEC5]"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-[#1C2B33] mb-8 outfit"
          variants={fadeUp}
          custom={0}
        >
          🛠️ Edit Post
        </motion.h2>

        <form className="space-y-6">
          {/* Title */}
          <motion.div variants={fadeUp} custom={1}>
            <label className="block font-medium text-[#37474F] mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-[#B0BEC5] px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#00838F] focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
            />
          </motion.div>

          {/* Tags */}
          <motion.div variants={fadeUp} custom={2}>
            <label className="block font-medium text-[#37474F] mb-1">
              Tags
            </label>
            <input
              type="text"
              className="w-full border border-[#B0BEC5] px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#00838F] focus:outline-none"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. spirituality, wisdom"
            />
          </motion.div>

          {/* Category */}
          <motion.div variants={fadeUp} custom={3}>
            <label className="block font-medium text-[#37474F] mb-1">
              Category
            </label>
            <div className="relative">
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory(val);
                  setFilteredCategories(
                    categories.filter((cat) =>
                      cat.toLowerCase().includes(val.toLowerCase())
                    )
                  );
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                placeholder="Search or select category"
                className="w-full border border-[#B0BEC5] px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-[#00838F] focus:outline-none"
              />
              {showDropdown && filteredCategories.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-lg bg-white border border-[#B0BEC5] shadow-lg">
                  {filteredCategories.map((cat, idx) => (
                    <li
                      key={idx}
                      onMouseDown={() => {
                        setCategory(cat);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-[#E0F7FA] cursor-pointer text-[#37474F]"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          {/* Cover Image */}
          <motion.div variants={fadeUp} custom={4}>
            <label className="block font-medium text-[#37474F] mb-1">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="block mt-1"
            />
            {uploading && (
              <p className="text-sm text-[#00838F] italic mt-1">
                Uploading image...
              </p>
            )}
            {coverImage && (
              <>
                <div className="mt-3 flex flex-wrap gap-3">
                  <input
                    type="text"
                    value={coverWidth}
                    onChange={(e) => setCoverWidth(e.target.value)}
                    placeholder="Width (e.g. 100%)"
                    className="border px-3 py-1 rounded w-36"
                  />
                  <input
                    type="text"
                    value={coverHeight}
                    onChange={(e) => setCoverHeight(e.target.value)}
                    placeholder="Height (e.g. auto)"
                    className="border px-3 py-1 rounded w-36"
                  />
                </div>
                <img
                  src={coverImage}
                  alt="Cover"
                  className="mt-4 rounded-xl border border-[#B0BEC5] shadow-sm"
                  style={{
                    width: coverWidth,
                    height: coverHeight,
                    objectFit: "contain",
                  }}
                />
              </>
            )}
          </motion.div>
          <motion.div
            className="flex justify-end"
            variants={fadeUp}
            custom={5.5}
          >
            <button
              type="button"
              onClick={() => setPreviewMode((prev) => !prev)}
              className="mb-3 bg-[#00838F] hover:bg-[#006064] text-white px-4 py-1 rounded-full text-sm font-medium transition"
            >
              {previewMode ? "🔧 Back to Edit" : "👁️ Preview Blog"}
            </button>
          </motion.div>

          {/* Editor or Preview */}
          <motion.div variants={fadeUp} custom={6}>
            <label className="block text-base font-medium text-[#37474F] mb-1">
              Content
            </label>

            {previewMode ? (
              <div className="prose prose-lg max-w-none p-5 bg-white border border-[#CFD8DC] rounded-xl shadow-md min-h-[300px]">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            ) : (
              <RichTextEditor content={content} onChange={setContent} />
            )}
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-6"
            variants={fadeUp}
            custom={6}
          >
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="bg-gray-300 hover:bg-gray-400 text-[#263238] font-medium px-5 py-2 rounded-full shadow-sm transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "💾 Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              className="bg-[#00838F] hover:bg-[#006064] text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "📤 Update & Publish"}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </section>
  );
};

export default EditPost;
