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
        }
      );

      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-md bg-white p-8 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6">Manage Account</h1>

      <div className="mb-4">
        <label className="block mb-1 text-gray-600">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-600">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-gray-600">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        Save Changes
      </button>
    </div>
  );
}