import axiosInstance from '../utils/axiosInstance';

export const createPost = async (postData) => {
  const response = await axiosInstance.post('/api/posts', postData);
  return response.data;
};

export const uploadPostImage = async (formData) => {
  const response = await axiosInstance.post('/api/posts/upload-image', formData);
  return response.data;
};
