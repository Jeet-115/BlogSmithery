import axiosInstance from "../utils/axiosInstance";

// Toggle follow/unfollow a user
export const toggleFollowUser = async (targetUserId) => {
  const res = await axiosInstance.patch(`/api/users/follow/${targetUserId}`);
  return res.data; // { following: true/false, ...optional extras }
};
