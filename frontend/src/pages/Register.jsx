import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      alert("Register success!");
      navigate("/login"); // สมัครเสร็จให้ไปหน้า login เลย
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                  bg-gradient-to-br from-emerald-100 via-white to-green-50 
                  px-4 sm:px-6 py-6"
    >
      <div
        className="flex flex-col md:flex-row 
                    w-full max-w-5xl 
                    bg-white rounded-3xl shadow-2xl 
                    overflow-hidden border border-gray-100"
      >
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

        {/* ===== RIGHT SIDE (Register Form) ===== */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center 
                      px-6 sm:px-10 py-10"
        >
          <div className="w-full max-w-sm">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
              Create Account
            </h2>

            <p className="text-gray-500 mb-6 text-sm sm:text-base">
              Start tracking your health today 💚
            </p>

            <form onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl p-3 mb-4 
                         focus:outline-none focus:ring-2 focus:ring-emerald-400 
                         transition"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                Register
              </button>
            </form>

            <p className="mt-5 text-sm text-gray-500 text-center">
              มีบัญชีแล้ว?{" "}
              <Link
                to="/login"
                className="text-emerald-600 font-semibold hover:underline"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
