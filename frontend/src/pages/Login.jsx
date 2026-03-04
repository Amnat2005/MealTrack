import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login clicked");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      console.log("Response:", res.data);

      localStorage.setItem("token", res.data.token);

      alert("Login success");

      navigate("/dashboard");
    } catch (err) {
      console.log("ERROR:", err);
      alert("Login failed");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center 
                  bg-gradient-to-br from-emerald-100 via-white to-green-50 
                  px-4 sm:px-6 py-6">

    <div className="flex flex-col md:flex-row 
                    w-full max-w-5xl 
                    bg-white rounded-3xl shadow-2xl overflow-hidden">

      {/* ===== LEFT SIDE (Image) ===== */}
      <div className="relative md:w-1/2 h-48 sm:h-64 md:h-auto hidden md:block">
        <img
          src="/healthy.avif"
          alt="Healthy lifestyle"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-3xl lg:text-4xl font-bold tracking-wider drop-shadow-xl">
            MealTrack
          </h1>
        </div>
      </div>

      {/* ===== RIGHT SIDE (Form) ===== */}
      <div className="w-full md:w-1/2 flex items-center justify-center 
                      px-6 sm:px-10 py-10">

        <form onSubmit={handleLogin} className="w-full max-w-sm">

          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Track your calories & stay healthy 💚
          </p>

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl p-3 mb-4 
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 
                       transition"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl p-3 mb-5 
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 
                       transition"
          />

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 
                       text-white font-semibold py-3 rounded-xl 
                       transition duration-300 shadow-md"
          >
            Login
          </button>

          <p className="mt-5 text-sm text-gray-500 text-center">
            ยังไม่มีบัญชี?{" "}
            <Link
              to="/register"
              className="text-emerald-600 font-semibold hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </p>

        </form>
      </div>

    </div>
  </div>
);
}
