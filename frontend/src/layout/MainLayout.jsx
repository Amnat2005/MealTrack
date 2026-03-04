import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function MainLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItem =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";
  const active =
    "bg-emerald-500 text-white shadow-md";
  const inactive =
    "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 
                      px-4 sm:px-6 lg:px-10 py-4 
                      flex items-center justify-between 
                      sticky top-0 z-50">

        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="text-xl sm:text-2xl font-bold cursor-pointer"
        >
          <span className="text-emerald-600">Meal</span>
          <span className="text-gray-900">Track</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/meals"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Meals
          </NavLink>

          <NavLink
            to="/foods"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Foods
          </NavLink>

          <NavLink
            to="/report"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Report
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            ☰
          </button>

          {/* Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setOpen(!open)}
              className="w-9 h-9 sm:w-10 sm:h-10 
                         rounded-full bg-emerald-500 
                         text-white flex items-center 
                         justify-center cursor-pointer 
                         font-bold shadow-md 
                         hover:bg-emerald-600 transition"
            >
              A
            </div>

            {open && (
              <div className="absolute right-0 mt-3 w-48 
                              bg-white rounded-xl 
                              shadow-xl border border-gray-100 
                              py-2 text-gray-700">
                <NavLink
                  to="/account"
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  Manage account
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-2 shadow-sm">
          <NavLink
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block ${navItem} ${isActive ? active : inactive}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/meals"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block ${navItem} ${isActive ? active : inactive}`
            }
          >
            Meals
          </NavLink>

          <NavLink
            to="/foods"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block ${navItem} ${isActive ? active : inactive}`
            }
          >
            Foods
          </NavLink>

          <NavLink
            to="/report"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block ${navItem} ${isActive ? active : inactive}`
            }
          >
            Report
          </NavLink>
        </div>
      )}

      {/* CONTENT */}
      <main className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <Outlet />
      </main>

    </div>
  );
}