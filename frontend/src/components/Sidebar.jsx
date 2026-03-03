import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      className="
      w-64
      min-h-screen
      bg-white/70
      backdrop-blur-lg
      border-r
      border-gray-200
      p-6
    "
    >
      <h1 className="text-2xl font-bold text-green-600 mb-8">
        MealTrack
      </h1>

      <nav className="flex flex-col gap-4">

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/meals">Meals</Link>

        <Link to="/foods">Foods</Link>

        <Link to="/report">Report</Link>

      </nav>
    </div>
  );
}