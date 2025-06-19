import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { setCredentials } from "../../redux/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await registerUser(formData);
      dispatch(setCredentials(res));
      navigate("/");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full max-w-sm outfit"
    >
      <h2 className="text-3xl font-bold text-[#1C2B33] text-center mb-2">
        Register
      </h2>
      <p className="text-[#37474F] text-center text-sm mb-6">
        Create an account to start your blogging journey.
      </p>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full px-4 py-3 border border-[#00838F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00838F] bg-white/70 text-[#1C2B33] placeholder-[#90A4AE]"
          onChange={handleChange}
          required
        />
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
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
        </div>
      </div>

      <div className="text-right mt-2 mb-6">
        <Link to="/login" className="text-sm text-[#00838F] hover:underline">
          Already have an account? Login
        </Link>
      </div>

      <button
        type="submit"
        className="w-full bg-[#1C2B33] text-white py-3 rounded-lg hover:bg-[#37474F] transition-all font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

export default RegisterForm;
