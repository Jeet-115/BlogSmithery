import axiosInstance from "../utils/axiosInstance";

export const getAuthorDetails = async (authorId, category = "") => {
  const res = await axiosInstance.get(`/api/author/${authorId}`, {
    params: category ? { category } : {},
  });
  return res.data;
};