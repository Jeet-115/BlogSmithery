import axiosInstance from "../utils/axiosInstance";

export const fetchAdminOverview = async () => {
  const res = await axiosInstance.get("/api/admin/overview");
  return res.data;
};
