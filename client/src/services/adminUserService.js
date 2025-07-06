import axiosInstance from "../utils/axiosInstance";

// Fetch all users
export const fetchAllUsers = async () => {
  const res = await axiosInstance.get("/api/admin/users");
  return res.data;
};

// Update a user
export const updateUserById = async (id, updatedData) => {
  const res = await axiosInstance.put(`/api/admin/users/${id}`, updatedData);
  return res.data;
};

// Delete a user
export const deleteUserById = async (id) => {
  const res = await axiosInstance.delete(`/api/admin/users/${id}`);
  return res.data;
};

// Get full user details
export const getUserById = async (id) => {
  const res = await axiosInstance.get(`/api/admin/users/${id}`);
  return res.data;
};

// Delete a user's post (by admin)
export const deleteUserPostByAdmin = async (postId) => {
  const res = await axiosInstance.delete(`/api/admin/users/posts/${postId}`);
  return res.data;
};

// Delete a user's comment (by admin)
export const deleteUserCommentByAdmin = async (commentId) => {
  const res = await axiosInstance.delete(`/api/admin/users/comments/${commentId}`);
  return res.data;
};

export const getCommentsForPost = async (postId) => {
  const res = await axiosInstance.get(`/api/admin/users/posts/${postId}/comments`); // ✅ fixed
  return res.data;
};

export const getFullPostById = async (postId) => {
  const res = await axiosInstance.get(`/api/admin/users/posts/${postId}/full`);
  return res.data;
};

export const banUserById = async (id, data) => {
  const res = await axiosInstance.put(`/api/admin/users/${id}/ban`, data);
  return res.data;
};

// Unban user
export const unbanUserById = async (id) => {
  const res = await axiosInstance.put(`/api/admin/users/${id}/unban`);
  return res.data;
};