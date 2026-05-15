import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const data = {
  labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  datasets: [
    {
      label: "Weight",
      data: [40, 50, 45, 70, 65, 85, 75],
      backgroundColor: "#14532d",
      borderRadius: 6,
      barThickness: 14,
    },
    {
      label: "Calories",
      data: [30, 40, 35, 55, 50, 70, 60],
      backgroundColor: "#4ade80",
      borderRadius: 6,
      barThickness: 14,
    },
    {
      label: "Water Intake",
      data: [20, 30, 25, 45, 40, 55, 50],
      backgroundColor: "#bbf7d0",
      borderRadius: 6,
      barThickness: 14,
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false, // ✅ مهم عشان الشارت يملا الـ div
  plugins: {
    legend: { position: "top" as const },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { stepSize: 20 },
      grid: { color: "#e5e7eb" },
    },
    x: { grid: { display: false } },
  },
}

export default function WeightChart() {
  return (
    // ✅ w-full بدل w-240
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">
      <h3 className="font-semibold text-gray-800 mb-4 text-sm md:text-base">
        Weight & Health Trends
      </h3>
      {/* ✅ ارتفاع مناسب responsive */}
      <div className="h-48 md:h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}