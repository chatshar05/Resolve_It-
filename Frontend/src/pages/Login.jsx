import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      const token = res.data.token;
      const user = res.data.user;

      // store token
      localStorage.setItem("token", token);

      // store user
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "Student") navigate("/studentdash");
      else if (user.role === "Staff") navigate("/staffdash");
      else if (user.role === "Admin") navigate("/admindash");
    } catch (err) {
      console.log(err);
      alert("Invalid credentials");
    }
  };
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-6">
      {/* background glow */}

      <div className="absolute top-[-200px] left-[20%] w-[500px] h-[500px] bg-blue-600/30 blur-[150px] rounded-full" />

      <div className="absolute bottom-[-200px] right-[20%] w-[500px] h-[500px] bg-purple-600/30 blur-[150px] rounded-full" />

      <form
        onSubmit={handleLogin}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-[380px] shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>

        <p className="text-slate-400 mb-8">Login to access ResolveIt</p>

        {/* Email */}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />

        {/* Password */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />

        {/* Login Button */}

        <button
          type="submit"
          className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-sm text-slate-400 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
