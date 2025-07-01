import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, uploadPostImage } from "../services/postService";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverWidth, setCoverWidth] = useState("100%");
  const [coverHeight, setCoverHeight] = useState("auto");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { url } = await uploadPostImage(formData);
      setCoverImage(url);
    } catch (err) {
      console.error("Cover image upload failed:", err);
      toast.error("Cover image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPost({
        title,
        tags: tags.split(",").map((t) => t.trim()),
        content,
        coverImage,
      });

      toast.success("Post published 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen  py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl border border-[#B0BEC5]">
        <h2 className="text-3xl font-bold text-center text-[#1C2B33] mb-8 outfit">
          ✍️ Create a New Blog Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-base font-medium text-[#37474F] mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-[#B0BEC5] px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-base font-medium text-[#37474F] mb-1">
              Tags
            </label>
            <input
              type="text"
              className="w-full border border-[#B0BEC5] px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white"
              placeholder="e.g. wisdom, healing, positivity"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-base font-medium text-[#37474F] mb-1">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="block"
            />

            {uploading && (
              <p className="text-sm text-[#00838F] italic flex items-center gap-2 mt-1">
                <span className="animate-spin border-2 border-[#00ACC1] border-t-transparent rounded-full w-4 h-4"></span>
                Uploading cover image...
              </p>
            )}

            {coverImage && (
              <>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <label className="text-sm text-[#37474F]">Width:</label>
                    <input
                      type="text"
                      className="border border-[#90A4AE] px-2 py-1 rounded text-sm w-24 ml-2"
                      value={coverWidth}
                      onChange={(e) => setCoverWidth(e.target.value)}
                      placeholder="e.g. 100%, 400px"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#37474F]">Height:</label>
                    <input
                      type="text"
                      className="border border-[#90A4AE] px-2 py-1 rounded text-sm w-24 ml-2"
                      value={coverHeight}
                      onChange={(e) => setCoverHeight(e.target.value)}
                      placeholder="e.g. auto, 300px"
                    />
                  </div>
                </div>
                <img
                  src={coverImage}
                  alt="Cover"
                  style={{
                    width: coverWidth,
                    height: coverHeight,
                    objectFit: "contain",
                  }}
                  className="rounded-lg mt-3 border border-[#B0BEC5] shadow-sm"
                />
              </>
            )}
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-base font-medium text-[#37474F] mb-1">
              Content
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-[#00838F] hover:bg-[#006064] text-white font-semibold px-6 py-3 rounded-full shadow-md transition disabled:opacity-50 block mx-auto"
            disabled={loading}
          >
            {loading ? "Publishing..." : "📤 Publish"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
