import { useEffect, useState } from "react";
import axios from "axios";

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/foods", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoods(res.data || []);
    } catch (err) {
      console.log(err);
      setFoods([]);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/foods",
        { name, calories },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setName("");
      setCalories("");
      fetchFoods();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchFoods();
    } catch (err) {
      console.log(err);
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Food Database
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your food items and calorie information
          </p>
        </div>

        {/* ADD FOOD */}
        <div
          className="bg-white rounded-2xl shadow-lg 
                      border border-emerald-100 
                      p-5 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Add New Food
          </h2>

          <form
            onSubmit={handleAddFood}
            className="grid grid-cols-1 
                     sm:grid-cols-2 
                     lg:grid-cols-3 
                     gap-4"
          >
            <input
              type="text"
              placeholder="Food name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-200 
                       rounded-xl px-4 py-2.5
                       text-sm sm:text-base
                       focus:outline-none 
                       focus:ring-2 focus:ring-emerald-500 
                       focus:border-emerald-400 transition"
              required
            />

            <input
              type="number"
              placeholder="Calories (kcal)"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="border border-gray-200 
                       rounded-xl px-4 py-2.5
                       text-sm sm:text-base
                       focus:outline-none 
                       focus:ring-2 focus:ring-emerald-500 
                       focus:border-emerald-400 transition"
              required
            />

            <button
              type="submit"
              className="bg-gradient-to-r 
                       from-emerald-500 to-teal-500 
                       text-white rounded-xl 
                       px-4 py-2.5 font-medium 
                       shadow-md hover:shadow-lg 
                       transition w-full"
            >
              Add Food
            </button>
          </form>
        </div>

        {/* FOOD LIST */}
        <div
          className="bg-white rounded-2xl shadow-lg 
                      border border-emerald-100 
                      p-4 sm:p-6"
        >
          {/* DESKTOP HEADER */}
          <div
            className="hidden sm:grid grid-cols-3 
                        px-6 py-3 text-sm font-semibold 
                        bg-gradient-to-r 
                        from-emerald-500 to-teal-500 
                        text-white rounded-xl"
          >
            <div>Food Name</div>
            <div>Calories</div>
            <div className="text-right">Action</div>
          </div>

          <div className="mt-4 space-y-4">
            {foods.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                No foods available.
              </div>
            ) : (
              foods.map((food) => (
                /* MOBILE CARD */
                <div
                  key={food.id}
                  className="sm:grid sm:grid-cols-3 sm:items-center
                           bg-gray-50 rounded-xl 
                           p-4 sm:px-6 sm:py-4
                           hover:bg-emerald-50 
                           transition shadow-sm hover:shadow-md"
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden space-y-2">
                    <div className="font-medium text-gray-800">{food.name}</div>
                    <div className="text-emerald-600 font-semibold">
                      {food.calories} kcal
                    </div>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:block font-medium text-gray-800">
                    {food.name}
                  </div>

                  <div className="hidden sm:block font-semibold text-emerald-600">
                    {food.calories} kcal
                  </div>

                  <div className="hidden sm:block text-right">
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="text-sm text-gray-400 hover:text-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
