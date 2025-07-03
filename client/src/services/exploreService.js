// src/services/exploreService.js
import axiosInstance from '../utils/axiosInstance';

export const getExplorePostsPublic = async (params) => {
  const res = await axiosInstance.get('/api/explore/public', { params });
  return res.data;
};

export const getExplorePostsPrivate = async (params) => {
  const res = await axiosInstance.get('/api/explore/private', { params });
  return res.data;
};
