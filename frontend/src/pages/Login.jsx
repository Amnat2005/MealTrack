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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow w-80"
      >
        <h2 className="text-2xl mb-4">Login</h2>

        <input
          name="email"
          placeholder="email"
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <input
          name="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        <button type="submit" className="w-full bg-green-600 text-white p-2">
          Login
        </button>
        <p style={{ marginTop: "10px" }}>
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
        </p>
      </form>
    </div>
  );
}
