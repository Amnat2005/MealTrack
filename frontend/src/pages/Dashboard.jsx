import { useEffect, useState } from "react";
import axios from "axios";
import SummaryCard from "../components/SummaryCard";

export default function Dashboard() {
  const [meals, setMeals] = useState([]);
  const [todayCalories, setTodayCalories] = useState(0);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mealsData = res.data.data || [];

      setMeals(mealsData);

      // 🔥 คำนวณ Today Calories ทันทีหลังได้ข้อมูล
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTotal = mealsData
        .filter((meal) => {
          const mealDate = new Date(meal.meal_date);
          mealDate.setHours(0, 0, 0, 0);
          return mealDate.getTime() === today.getTime();
        })
        .reduce((sum, meal) => sum + Number(meal.total_calories), 0);

      setTodayCalories(todayTotal);
    } catch (err) {
      console.log(err);
      setMeals([]);
      setTodayCalories(0);
    }
  };

  // 🔥 Average Calories
  const averageCalories =
    meals.length > 0
      ? Math.round(
          meals.reduce((sum, meal) => sum + Number(meal.total_calories), 0) /
            meals.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 p-8">
      <div
        className="max-w-6xl mx-auto 
                    px-4 sm:px-6 lg:px-8 
                    py-6 sm:py-8 
                    space-y-10"
      >
        {/* HERO SECTION */}
        <div
          className="bg-gradient-to-r 
                   from-emerald-500 via-green-500 to-teal-500
                   rounded-3xl 
                   p-6 sm:p-8 lg:p-10
                   text-white shadow-lg 
                   relative overflow-hidden"
        >
          <div className="relative z-10">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl 
                         font-bold tracking-tight"
            >
              Nutrition Dashboard
            </h1>
            <p
              className="mt-2 text-white/90 
                        text-sm sm:text-base"
            >
              Track your calories. Improve your lifestyle. Stay consistent 💚
            </p>
          </div>

          <div
            className="absolute -right-10 -top-10 
                        w-40 h-40 
                        bg-white/20 rounded-full blur-3xl"
          ></div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Today */}
          <div
            className="rounded-2xl p-5 sm:p-6
                     bg-gradient-to-br from-orange-400 to-amber-400
                     text-white shadow-md 
                     transition duration-300 
                     hover:shadow-lg"
          >
            <p className="text-sm opacity-90">Today's Calories</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {todayCalories} kcal
            </h2>
          </div>

          {/* Total */}
          <div
            className="rounded-2xl p-5 sm:p-6
                     bg-gradient-to-br from-sky-400 to-blue-400
                     text-white shadow-md 
                     transition duration-300 
                     hover:shadow-lg"
          >
            <p className="text-sm opacity-90">Total Meal Records</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {meals.length} records
            </h2>
          </div>

          {/* Average */}
          <div
            className="rounded-2xl p-5 sm:p-6
                     bg-gradient-to-br from-violet-400 to-purple-400
                     text-white shadow-md 
                     transition duration-300 
                     hover:shadow-lg"
          >
            <p className="text-sm opacity-90">Average Calories</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {averageCalories} kcal
            </h2>
          </div>
        </div>

        {/* RECENT MEALS */}
        <div
          className="bg-white/80 backdrop-blur-md 
                      rounded-3xl shadow-lg 
                      p-6 sm:p-8 
                      border border-gray-100"
        >
          <h2
            className="text-xl sm:text-2xl 
                       font-semibold mb-6 
                       text-gray-800"
          >
            Recent Meals
          </h2>

          {meals.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              🍽 No meals recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {meals.slice(0, 5).map((meal) => {
                const formattedDate = new Date(
                  meal.meal_date,
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={meal.id}
                    className="flex flex-col sm:flex-row 
                             sm:justify-between sm:items-center 
                             gap-2 sm:gap-0
                             p-4 sm:p-5 
                             rounded-2xl 
                             bg-white shadow-sm 
                             hover:shadow-md 
                             transition duration-300"
                  >
                    <div>
                      <p
                        className="font-semibold text-gray-800 
                                  capitalize text-base sm:text-lg"
                      >
                        {meal.meal_type}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {formattedDate}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p
                        className="text-xl sm:text-2xl 
                                  font-bold text-emerald-500"
                      >
                        {meal.total_calories}
                      </p>
                      <span className="text-xs sm:text-sm text-gray-400">
                        kcal
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
