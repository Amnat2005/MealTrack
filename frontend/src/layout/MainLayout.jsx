import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function MainLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-green-600 mb-8">
          MealTrack
        </h1>

        <nav className="flex flex-col gap-4 text-gray-700">
          <Link to="/dashboard" className="hover:text-green-600">
            Dashboard
          </Link>
          <Link to="/meals" className="hover:text-green-600">
            Meals
          </Link>
          <Link to="/foods" className="hover:text-green-600">
            Foods
          </Link>
          <Link to="/report" className="hover:text-green-600">
            Report
          </Link>
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="h-16 bg-white shadow flex items-center justify-end px-8">

          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center cursor-pointer font-bold"
            >
              A
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 text-gray-700">
                <Link
                  to="/account"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Manage account
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}