import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePostById, uploadPostImage } from "../services/postService";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from "react-hot-toast";

const categories = [/* same as before */];

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

      toast.success(status === "published" ? "Post updated & published" : "Draft updated");
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
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl border border-[#B0BEC5]">
        <h2 className="text-3xl font-bold text-center text-[#1C2B33] mb-8 outfit">🛠️ Edit Post</h2>

        <form className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-medium text-[#37474F] mb-1">Title</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium text-[#37474F] mb-1">Tags</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded-lg"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-[#37474F] mb-1">Category</label>
            <div className="relative">
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  setCategory(val);
                  setFilteredCategories(
                    categories.filter((cat) => cat.toLowerCase().includes(val.toLowerCase()))
                  );
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                className="w-full border px-4 py-2 rounded-lg"
              />
              {showDropdown && filteredCategories.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-lg bg-white border shadow-lg">
                  {filteredCategories.map((cat, idx) => (
                    <li
                      key={idx}
                      onMouseDown={() => {
                        setCategory(cat);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-[#E0F7FA] cursor-pointer"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block font-medium text-[#37474F] mb-1">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
            {uploading && <p className="text-sm text-blue-500 mt-1">Uploading image...</p>}
            {coverImage && (
              <>
                <div className="mt-3">
                  <input
                    type="text"
                    value={coverWidth}
                    onChange={(e) => setCoverWidth(e.target.value)}
                    placeholder="Width (e.g. 100%)"
                    className="border px-2 py-1 rounded mr-2"
                  />
                  <input
                    type="text"
                    value={coverHeight}
                    onChange={(e) => setCoverHeight(e.target.value)}
                    placeholder="Height (e.g. auto)"
                    className="border px-2 py-1 rounded"
                  />
                </div>
                <img
                  src={coverImage}
                  alt="Cover"
                  className="mt-3 rounded border shadow"
                  style={{ width: coverWidth, height: coverHeight, objectFit: "contain" }}
                />
              </>
            )}
          </div>

          {/* Editor */}
          <div>
            <label className="block font-medium text-[#37474F] mb-1">Content</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* Submit */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-5 py-2 rounded-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "💾 Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              className="bg-[#00838F] hover:bg-[#006064] text-white font-semibold px-6 py-2 rounded-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "📤 Update & Publish"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
