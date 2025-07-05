import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { setCredentials } from "../../redux/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AlertModal from "../AlertModal";
import { motion } from "framer-motion";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectParam = new URLSearchParams(location.search).get("redirect");
  const redirectState = location.state?.redirectTo;
  const fallback = sessionStorage.getItem("redirectAfterAuth");
  const redirectTo = redirectState || redirectParam || fallback;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser(formData);
      dispatch(setCredentials({ user: res }));
      sessionStorage.setItem("token", res.token);
      sessionStorage.setItem("user", JSON.stringify(res));

      if (redirectTo) {
        navigate(redirectTo);
        sessionStorage.removeItem("redirectAfterAuth");
      } else {
        navigate(res.role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Login failed");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md mx-auto outfit"
    >
      <h2 className="text-3xl font-bold text-[#1C2B33] text-center mb-2">
        Login
      </h2>
      <p className="text-[#37474F] text-center text-sm mb-6">
        Sign in to explore powerful blog insights.
      </p>

      <div className="space-y-5">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-[#00838F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white/70 text-[#1C2B33] placeholder-[#90A4AE]"
          onChange={handleChange}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-[#00838F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white/70 text-[#1C2B33] placeholder-[#90A4AE]"
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#37474F]"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>
        </div>
      </div>

      <div className="text-right mt-3">
        <Link
          to={{
            pathname: "/register",
            search: redirectTo
              ? `?redirect=${encodeURIComponent(redirectTo)}`
              : "",
          }}
          className="text-sm text-[#00838F] hover:underline"
        >
          New User? Register
        </Link>
      </div>

      <button
        type="submit"
        className="w-full bg-[#00838F] hover:bg-[#006064] text-white py-3 rounded-lg transition-all font-medium mt-6"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {/* Alert Modal */}
      <AlertModal
        open={showAlert}
        onClose={() => {
          setShowAlert(false);
          navigate("/");
        }}
        title="Login Error"
        message={errorMsg}
      />
    </motion.form>
  );
}

export default LoginForm;
