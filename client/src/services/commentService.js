import axiosInstance from "../utils/axiosInstance";

export const deleteCommentById = async (commentId) => {
  const res = await axiosInstance.delete(`/api/comments/${commentId}`);
  return res.data;
};
