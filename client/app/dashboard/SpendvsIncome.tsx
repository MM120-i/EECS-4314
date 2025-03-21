import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// TODO: Need to get real data
const SpendvsIncome = () => {
  const data = {
    //chart data
    labels: ["January", "February", "March", "April", "May"], // x-axis labels
    datasets: [
      {
        label: "Spending",
        data: [5500, 3600, 1700, 5000, 5650], // MOCK DATA
        borderColor: "rgba(0, 149, 255, 1)",
      },
      {
        label: "Income",
        data: [800, 850, 950, 1000, 1200],
        borderColor: "rgba(7, 224, 152, 1)",
      },
    ],
  };

  // TODO: Need to get real data
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 6000,
        ticks: {
          stepSize: 250,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg h-[350px] w-full max-w-[880px] flex flex-col justify-center">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Spending vs Income
      </h2>
      {/* Chart Container */}
      <div className="w-full h-[350px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SpendvsIncome;
