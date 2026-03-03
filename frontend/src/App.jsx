import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Meals from "./pages/Meals";
import Foods from "./pages/Foods";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* หน้าเริ่มต้น */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* หลัง Login ใช้ Layout ครอบ */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/report" element={<Report />} />
          <Route path="/account" element={<Account />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}