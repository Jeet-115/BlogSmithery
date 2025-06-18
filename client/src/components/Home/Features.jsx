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
  { icon: <FaPenNib size={30} />, text: "Create rich-text blog posts" },
  { icon: <FaRobot size={30} />, text: "Get AI writing assistance" },
  { icon: <FaHeart size={30} />, text: "Like and comment on blogs" },
  { icon: <FaSearch size={30} />, text: "Search by tags or categories" },
  { icon: <FaUserEdit size={30} />, text: "Manage your profile & history" },
  { icon: <FaLock size={30} />, text: "Secure JWT-based authentication" },
  { icon: <FaRobot size={30} />, text: "AI-suggested blog titles and tags" },
  { icon: <FaRobot size={30} />, text: "Fix grammar and improve tone with AI" },
];

function Features() {
  const repeatedFeatures = [...features, ...features];

  return (
    <div className="py-12 px-6 md:px-20 overflow-hidden">
      {/* Slide in title */}
      <motion.h2
        className="text-3xl font-bold mb-8 text-center text-[#2E3C43] inter"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        Features
      </motion.h2>

      {/* Slide in feature list */}
      <motion.div
        className="relative w-full overflow-hidden inter"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="flex w-max space-x-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          {repeatedFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-md"
            >
              <div className="text-[#00838F] mb-4">{feature.icon}</div>
              <p className="text-lg font-medium text-[#37474F]">
                {feature.text}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Features;
