import { useEffect, useState } from "react";
import axios from "axios";

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [foods, setFoods] = useState([]);

  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState("Breakfast");
  const [mealDate, setMealDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    fetchMeals();
    fetchFoods();
  }, []);

  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/meals", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data.data)) {
        setMeals(res.data.data);
      } else {
        setMeals([]);
      }
    } catch (err) {
      console.log(err);
      setMeals([]);
    }
  };

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/foods", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoods(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();

    if (!selectedFood) {
      alert("Please select food");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        food_id: Number(selectedFood),
        quantity: Number(quantity),
        meal_type: mealType,
        meal_date: mealDate,
      };

      await axios.post("http://localhost:5000/api/meals", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedFood("");
      setQuantity(1);
      setMealType("Breakfast");
      setMealDate(new Date().toISOString().split("T")[0]);

      fetchMeals();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/meals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchMeals();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

  const groupedByDate = meals.reduce((acc, meal) => {
    const dateKey = meal.meal_date;

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: meal.meal_date,
        meals: {},
        totalCalories: 0,
      };
    }

    if (!acc[dateKey].meals[meal.meal_type]) {
      acc[dateKey].meals[meal.meal_type] = {
        items: [],
        totalCalories: 0,
      };
    }

    acc[dateKey].meals[meal.meal_type].items.push(meal);
    acc[dateKey].meals[meal.meal_type].totalCalories += Number(
      meal.total_calories,
    );

    acc[dateKey].totalCalories += Number(meal.total_calories);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 p-8">
      <div
        className="max-w-5xl mx-auto 
                    px-4 sm:px-6 lg:px-8 
                    py-6 sm:py-8 
                    space-y-10"
      >
        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Meals Tracker
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Track and analyze your daily nutrition
          </p>
        </div>

        {/* ADD MEAL */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Meal</h2>

          <form
            onSubmit={handleAddMeal}
            className="grid grid-cols-1 
                     sm:grid-cols-2 
                     lg:grid-cols-4 
                     gap-4"
          >
            <select
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 
                       text-sm sm:text-base
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select food</option>
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name} ({food.calories} kcal)
                </option>
              ))}
            </select>

            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5"
            />

            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>

            <input
              type="date"
              value={mealDate}
              onChange={(e) => setMealDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 
                       text-white rounded-xl 
                       px-4 py-2.5 font-medium 
                       shadow-md hover:shadow-lg 
                       transition 
                       col-span-1 sm:col-span-2 lg:col-span-4"
            >
              Add Meal
            </button>
          </form>
        </div>

        {/* MEAL LIST */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            Recent Meals
          </h2>

          {meals.length === 0 ? (
            <p className="text-gray-400">No meals recorded.</p>
          ) : (
            Object.values(groupedByDate)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((day, index) => (
                <div key={index} className="mb-10">
                  {/* DATE HEADER */}
                  <div
                    className="flex flex-col sm:flex-row 
                                sm:justify-between sm:items-center 
                                gap-2 sm:gap-0 mb-6"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {formatDate(day.date)}
                    </h3>

                    <div
                      className="bg-emerald-100 text-emerald-700 
                                  px-4 py-1 rounded-full 
                                  font-semibold text-sm w-fit"
                    >
                      {day.totalCalories} kcal
                    </div>
                  </div>

                  {/* MEAL TYPES */}
                  <div className="space-y-6">
                    {Object.entries(day.meals).map(([mealType, mealData]) => (
                      <div
                        key={mealType}
                        className="bg-gray-50 rounded-2xl 
                                   p-4 sm:p-5 
                                   border border-gray-100"
                      >
                        {/* MEAL HEADER */}
                        <div className="flex justify-between mb-4">
                          <div className="font-semibold text-gray-700">
                            {mealType}
                          </div>

                          <div className="text-sm font-semibold text-emerald-600">
                            {mealData.totalCalories} kcal
                          </div>
                        </div>

                        {/* ITEMS */}
                        <div className="space-y-3">
                          {mealData.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col sm:flex-row 
                                         sm:justify-between sm:items-center
                                         gap-2 sm:gap-0
                                         bg-white rounded-xl 
                                         px-4 py-3 
                                         border border-gray-100"
                            >
                              <div className="text-sm text-gray-700">
                                {item.food_name}
                                <span className="text-gray-400 ml-2">
                                  x{item.quantity}
                                </span>
                              </div>

                              <button
                                onClick={() => handleDeleteMeal(item.id)}
                                className="text-xs text-red-500 
                                           hover:text-red-700 transition 
                                           self-start sm:self-auto"
                              >
                                remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
