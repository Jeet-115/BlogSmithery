import { motion } from "framer-motion";
import {
  FaPenNib,
  FaHeart,
  FaUserEdit,
  FaSearch,
  FaRobot,
  FaLock,
} from "react-icons/fa";

const features = [
  { icon: <FaPenNib size={28} />, text: "Create rich-text blog posts" },
  { icon: <FaRobot size={28} />, text: "Get AI writing assistance" },
  { icon: <FaHeart size={28} />, text: "Like and comment on blogs" },
  { icon: <FaSearch size={28} />, text: "Search by tags or categories" },
  { icon: <FaUserEdit size={28} />, text: "Manage your profile & history" },
  { icon: <FaLock size={28} />, text: "Secure JWT-based authentication" },
  { icon: <FaRobot size={28} />, text: "AI-suggested titles and tags" },
  { icon: <FaRobot size={28} />, text: "Fix grammar & tone with AI" },
];

function Features() {
  const repeatedFeatures = [...features, ...features]; // For continuous scroll effect

  return (
    <section className="bg-[#E0E0E0] py-16 px-4 md:px-20 relative overflow-hidden">
      {/* Section Title */}
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center text-[#1C2B33] mb-10 outfit"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        ✨ Platform Features
      </motion.h2>

      {/* Auto-scrolling feature carousel */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex w-max gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {repeatedFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 w-64 bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
            >
              <div className="text-[#00838F] mb-3">{feature.icon}</div>
              <p className="text-base font-medium text-[#37474F] leading-snug">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subtle background gradient or animation can go here */}
      <div className="absolute top-0 left-[-50px] w-[200px] h-[200px] bg-[#00838F]/10 blur-[100px] rounded-full -z-10"></div>
    </section>
  );
}

export default Features;
