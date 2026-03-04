import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Report() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data.data)) {
        setMeals(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= TODAY =================

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const todayCalories = meals
    .filter((meal) => {
      const mealDate = new Date(meal.meal_date);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === todayDate.getTime();
    })
    .reduce((sum, meal) => sum + Number(meal.total_calories), 0);

  // ================= LAST 7 DAYS =================

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.meal_date);
    mealDate.setHours(0, 0, 0, 0);
    return mealDate >= sevenDaysAgo;
  });

  const weeklyCalories = weeklyMeals.reduce(
    (sum, meal) => sum + Number(meal.total_calories),
    0,
  );

  // ================= GRAPH DATA =================

  const dailyMap = {};

  weeklyMeals.forEach((meal) => {
    const date = meal.meal_date;
    if (!dailyMap[date]) dailyMap[date] = 0;
    dailyMap[date] += Number(meal.total_calories);
  });

  const dailyData = Object.entries(dailyMap)
    .map(([date, calories]) => {
      const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      return {
        date: formattedDate,
        calories,
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // ================= BREAKDOWN =================

  const caloriesByType = meals.reduce((acc, meal) => {
    const type = meal.meal_type;
    if (!acc[type]) acc[type] = 0;
    acc[type] += Number(meal.total_calories);
    return acc;
  }, {});

  // ================= ANALYSIS =================

  let analysisText = "No data available yet.";

  if (meals.length > 0) {
    const avgDaily = weeklyCalories / 7;

    if (todayCalories > avgDaily + 300) {
      analysisText =
        "Today’s intake is significantly higher than your weekly average. Consider balancing your meals.";
    } else if (todayCalories < avgDaily - 300) {
      analysisText =
        "Today’s intake is lower than your weekly average. Make sure you're eating enough.";
    } else {
      analysisText =
        "Your intake today is consistent with your weekly average. Great job!";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* ===== HEADER ===== */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Nutrition Report
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Insightful overview of your calorie trends
          </p>
        </div>

        {/* ===== KPI SECTION ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* TODAY */}
          <div
            className="rounded-2xl p-5 sm:p-6 shadow-lg text-white
                     bg-gradient-to-br from-emerald-500 to-lime-500
                     transition hover:scale-[1.02]"
          >
            <p className="text-xs sm:text-sm opacity-80">Today</p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 sm:mt-3">
              {todayCalories}
            </h2>

            <p className="opacity-90 mt-1 sm:mt-2 text-xs sm:text-sm">
              kcal consumed
            </p>
          </div>

          {/* WEEKLY */}
          <div
            className="rounded-2xl p-5 sm:p-6 shadow-lg text-white
                     bg-gradient-to-br from-blue-500 to-cyan-500
                     transition hover:scale-[1.02]"
          >
            <p className="text-xs sm:text-sm opacity-80">Last 7 Days</p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 sm:mt-3">
              {weeklyCalories}
            </h2>

            <p className="opacity-90 mt-1 sm:mt-2 text-xs sm:text-sm">
              total kcal
            </p>
          </div>
        </div>

        {/* ===== GRAPH ===== */}
        <div className="rounded-2xl p-4 sm:p-6 shadow-lg bg-white">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
            7 Day Calorie Trend
          </h2>

          {dailyData.length === 0 ? (
            <p className="text-gray-400 text-sm">No data for last 7 days</p>
          ) : (
            <div className="w-full h-[220px] sm:h-[280px] lg:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ===== BOTTOM SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* INSIGHT */}
          <div
            className="rounded-2xl p-5 sm:p-6 shadow-md
                     bg-gradient-to-br from-emerald-100 to-emerald-50
                     border border-emerald-200"
          >
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-emerald-800">
              Insight & Analysis
            </h2>

            <p className="text-emerald-900 leading-relaxed text-sm sm:text-base">
              {analysisText}
            </p>
          </div>

          {/* BREAKDOWN */}
          <div
            className="rounded-2xl p-5 sm:p-6 shadow-md
                     bg-gradient-to-br from-blue-100 to-blue-50
                     border border-blue-200"
          >
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-800">
              Meal Breakdown
            </h2>

            {Object.keys(caloriesByType).length === 0 ? (
              <p className="text-gray-400 text-sm">No data available</p>
            ) : (
              Object.entries(caloriesByType).map(([type, calories]) => (
                <div
                  key={type}
                  className="flex justify-between items-center py-2 sm:py-3 border-b border-blue-200 last:border-none"
                >
                  <span className="capitalize text-blue-900 text-sm sm:text-base">
                    {type}
                  </span>
                  <span className="font-semibold text-blue-800 text-sm sm:text-base">
                    {calories} kcal
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
