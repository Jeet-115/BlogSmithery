import axiosInstance from "../utils/axiosInstance";

export const getNotifications = async () => {
  const res = await axiosInstance.get("/api/notifications");
  return res.data;
};