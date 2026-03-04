export default function SummaryCard({ title, value, unit }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">
      <p className="text-gray-500 text-sm tracking-wide">{title}</p>
      <h2 className="text-3xl font-bold mt-3 text-gray-800">
        {value}
        <span className="text-sm font-medium text-gray-500 ml-1">
          {unit}
        </span>
      </h2>
    </div>
  );
}