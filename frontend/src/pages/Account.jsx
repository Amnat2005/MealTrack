import { useState } from "react";
import axios from "axios";

export default function Account() {
  const [name, setName] = useState("Amnat");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br 
                  from-emerald-50 via-white to-green-50 
                  flex items-center justify-center 
                  px-4 sm:px-6 py-8"
    >
      <div
        className="w-full max-w-2xl 
                    bg-white rounded-3xl 
                    shadow-2xl border border-gray-100 
                    p-6 sm:p-8 md:p-10"
      >
        {/* ===== HEADER ===== */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Manage Account
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Update your profile and password settings
          </p>
        </div>

        {/* ===== FORM ===== */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 
                       rounded-xl px-4 py-3 
                       text-sm sm:text-base
                       focus:outline-none 
                       focus:ring-2 focus:ring-emerald-400 
                       focus:border-transparent 
                       transition"
            />
          </div>

          {/* Current Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-200 
                       rounded-xl px-4 py-3 
                       text-sm sm:text-base
                       focus:outline-none 
                       focus:ring-2 focus:ring-emerald-400 
                       focus:border-transparent 
                       transition"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 
                       rounded-xl px-4 py-3 
                       text-sm sm:text-base
                       focus:outline-none 
                       focus:ring-2 focus:ring-emerald-400 
                       focus:border-transparent 
                       transition"
            />
          </div>
        </div>

        {/* ===== BUTTON ===== */}
        <button
          onClick={handleSave}
          className="mt-8 w-full 
                   bg-emerald-500 hover:bg-emerald-600 
                   text-white font-semibold 
                   py-3 rounded-xl 
                   transition duration-300 
                   shadow-md hover:shadow-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
