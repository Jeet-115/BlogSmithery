import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./redux/authSlice";
import { getProfile } from "./services/authService";
import { useNavigate, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protection/ProtectedRoute";
import AdminRoute from "./protection/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./components/Dashboard/DashboardHome";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./components/Admin/AdminHome";

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await getProfile();
        dispatch(setCredentials({ user }));

        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        }
        else if (user.role === "user") {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.log("Not logged in or session expired");
      }
    };
    fetchProfile();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
        </Route>
    </Routes>
  );
};

export default AppContent;
