import axiosInstance from "../utils/axiosInstance";

// Update profile details (including photo URL)
export const updateProfileDetails = async (formData) => {
  const res = await axiosInstance.put("/api/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


// Fetch profile data if needed elsewhere
export const fetchUserProfile = async () => {
  const res = await axiosInstance.get("/api/profile");
  return res.data;
};
