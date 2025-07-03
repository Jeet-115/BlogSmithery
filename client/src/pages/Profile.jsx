import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { updateProfileDetails } from "../services/profileService";
import { setCredentials } from "../redux/authSlice";
import AlertModal from "../components/AlertModal";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: "",
    profilePhoto: "",
  });

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [alertTitle, setAlertTitle] = useState("Alert");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        twitter: user.socialLinks?.twitter || "",
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
        profilePhoto: user.profileImage || "",
      });
      setPreview(user.profileImage || null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("bio", form.bio);
    data.append("location", form.location);
    data.append("website", form.website);
    data.append(
      "socialLinks",
      JSON.stringify({
        twitter: form.twitter,
        linkedin: form.linkedin,
        github: form.github,
      })
    );
    if (file) data.append("profileImage", file);

    try {
      const res = await updateProfileDetails(data);
      dispatch(setCredentials({ user: res.user }));

      setAlertTitle("Success");
      setErrorMsg("Profile updated successfully!");
      setShowAlert(true);
    } catch (err) {
      console.error(err);

      setAlertTitle("Update Failed");
      setErrorMsg(
        err?.response?.data?.message ||
          "Something went wrong while updating profile."
      );
      setShowAlert(true);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 py-8 font-outfit text-[#1C2B33]"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">👤 Edit Profile</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-2xl shadow-md p-6"
        >
          <div className="flex items-center gap-4">
            <img
              src={preview || "/default-avatar.png"}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <label className="text-sm text-[#546E7A] cursor-pointer hover:underline">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#00838F]"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white/80 text-sm"
          />

          <input
            type="text"
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white/80 text-sm"
          />

          <input
            type="text"
            name="twitter"
            placeholder="Twitter Handle"
            value={form.twitter}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white/80 text-sm"
          />

          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn Handle"
            value={form.linkedin}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white/80 text-sm"
          />

          <input
            type="text"
            name="github"
            placeholder="GitHub Handle"
            value={form.github}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg bg-white/80 text-sm"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="bg-[#00838F] hover:bg-[#006064] text-white px-6 py-2 rounded-full shadow transition text-sm font-semibold"
          >
            Update Profile
          </motion.button>
        </form>

        {/* Live Preview (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block w-full max-w-sm bg-white/70 backdrop-blur border border-[#B0BEC5] rounded-2xl shadow-md p-6"
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={preview || "/default-avatar.png"}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border mb-3"
            />
            <h3 className="text-lg font-semibold">
              {form.name || "Your Name"}
            </h3>
            <p className="text-sm text-[#546E7A]">
              {form.bio || "Your bio..."}
            </p>
            {form.location && (
              <p className="text-xs text-[#78909C] mt-1">{form.location}</p>
            )}
            {form.website && (
              <a
                href={form.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#00838F] hover:underline mt-2"
              >
                {form.website}
              </a>
            )}
          </div>
        </motion.div>
      </div>
      <AlertModal
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="Profile Update"
        message={errorMsg}
      />
    </motion.section>
  );
};

export default Profile;
