import axiosInstance from '../utils/axiosInstance';

export const getOverviewStats = () => axiosInstance.get('/api/overview/me/overview').then(res => res.data);
export const getTopBlogs = () => axiosInstance.get('/api/overview/me/top-blogs').then(res => res.data);
export const getCategoryStats = () => axiosInstance.get('/api/overview/me/category-stats').then(res => res.data);
export const getPublishingTrends = () => axiosInstance.get('/api/overview/me/trends').then(res => res.data);
export const getStaleDrafts = () => axiosInstance.get('/api/overview/me/stale-drafts').then(res => res.data);
export const getWordStats = () => axiosInstance.get('/api/overview/me/word-stats').then(res => res.data);
export const getRecentlyLikedPosts = () => axiosInstance.get('/api/overview/me/liked-posts').then(res => res.data);
export const getMilestones = () => axiosInstance.get('/api/overview/me/milestones').then(res => res.data);
