export default function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-gray-500">Total Meals</h3>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-gray-500">Total Foods</h3>
          <p className="text-3xl font-bold text-blue-600">34</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-gray-500">Calories Today</h3>
          <p className="text-3xl font-bold text-orange-500">1,450</p>
        </div>
      </div>
    </div>
  );
}