import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./redux/authSlice";
import { getProfile } from "./services/authService";
import { useNavigate, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
          navigate("/admin/admindashboard", { replace: true });
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
    </Routes>
  );
};

export default AppContent;
