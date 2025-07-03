import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getAuthorDetails } from "../services/authorService";
import {
  FaMapMarkerAlt,
  FaLink,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toggleLikePost } from "../services/postService";

const AuthorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");
  const lastPostRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAuthorDetails(id, category);
      setAuthor(data.author);
      setPosts(data.posts);
    };
    fetchData();
  }, [id, category]);

  const handleLike = async (postId) => {
    await toggleLikePost(postId);
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: p.likes.includes("dummyUserId")
                ? p.likes.filter((l) => l !== "dummyUserId")
                : [...p.likes, "dummyUserId"],
            }
          : p
      )
    );
  };

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

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 text-[#1C2B33] font-outfit">
      {author && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-2xl shadow-md p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
        >
          <img
            src={author.profileImage || "/default-avatar.png"}
            alt="Author"
            className="w-24 h-24 rounded-full border object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{author.name}</h2>
            <p className="text-sm text-[#546E7A] mb-1">
              Joined on {new Date(author.createdAt).toLocaleDateString()}
            </p>
            {author.bio && (
              <p className="text-sm text-[#37474F] mb-1">{author.bio}</p>
            )}
            {author.location && (
              <p className="text-sm flex items-center gap-1 text-[#546E7A] mb-1">
                <FaMapMarkerAlt /> {author.location}
              </p>
            )}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#00838F] hover:underline flex items-center gap-1 mb-1"
              >
                <FaLink /> {author.website}
              </a>
            )}
            <div className="flex items-center gap-3 mt-2 text-[#546E7A]">
              {author.socialLinks?.twitter && (
                <a
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTwitter className="hover:text-[#1DA1F2]" />
                </a>
              )}
              {author.socialLinks?.linkedin && (
                <a
                  href={author.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin className="hover:text-[#0077B5]" />
                </a>
              )}
              {author.socialLinks?.github && (
                <a
                  href={author.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub className="hover:text-black" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]"
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <motion.div
            key={post._id}
            ref={idx === posts.length - 1 ? lastPostRef : null}
            onClick={() => navigate(`/dashboard/blog/${post._id}`)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt="cover"
                className="w-full h-52 object-cover"
              />
            )}

            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-semibold text-xl mb-1">{post.title}</h3>
                <p className="text-sm text-[#546E7A] mb-1">
                  {post.author?.name || "Anonymous"} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-[#78909C]">
                  {post.tags?.join(", ")} • {post.category}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AuthorPage;
