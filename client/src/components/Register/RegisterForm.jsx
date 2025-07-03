import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { setCredentials } from "../../redux/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AlertModal from "../AlertModal";
import { motion } from "framer-motion";

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  const redirectState = location.state?.redirectTo;
  const fallback = sessionStorage.getItem("redirectAfterAuth");
  const redirectTo = redirectState || redirectParam || fallback;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await registerUser(formData);
      dispatch(setCredentials({ user: res }));

      if (redirectTo) {
        sessionStorage.removeItem("redirectAfterAuth");
        navigate(redirectTo);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Registration failed");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white/60 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-sm mx-auto outfit"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-bold text-[#1C2B33] text-center mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Register
      </motion.h2>

      <motion.p
        className="text-[#37474F] text-center text-sm mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Create an account to start your blogging journey.
      </motion.p>

      <div className="space-y-4">
        <motion.input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full px-4 py-3 border border-[#00838F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white/70 text-[#1C2B33] placeholder-[#90A4AE]"
          onChange={handleChange}
          required
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-[#00838F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white/70 text-[#1C2B33] placeholder-[#90A4AE]"
          onChange={handleChange}
          required
          whileFocus={{ scale: 1.02 }}
        />
        <div className="relative">
          <motion.input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-[#00838F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white/70 text-[#1C2B33] placeholder-[#90A4AE]"
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#37474F]"
            onClick={() => setShowPassword(!showPassword)}
            title="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>
        </div>
      </div>

      <div className="text-right mt-2 mb-6">
        <Link
          to={{
            pathname: "/login",
            search: redirectTo
              ? `?redirect=${encodeURIComponent(redirectTo)}`
              : "",
          }}
          className="text-sm text-[#00838F] hover:underline"
        >
          Already have an account? Login
        </Link>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#00838F] hover:bg-[#006064] text-white py-3 rounded-lg transition-all font-medium"
      >
        {isLoading ? "Registering..." : "Register"}
      </motion.button>

      <AlertModal
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="Registration Error"
        message={errorMsg}
      />
    </motion.form>
  );
}

export default RegisterForm;
