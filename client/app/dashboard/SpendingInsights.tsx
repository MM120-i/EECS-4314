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

const SpendvsIncome = () => {
  const data = {
    //chart data
    labels: ["January", "February", "March"], // x-axis labels
    datasets: [
      {
        // TODO: Need to get real data
        label: "Entertainment",
        data: [150, 400, 450, 500, 250], // MOCK DATA
        borderColor: "rgba(167, 0, 255, 1)",
        tension: 0.5,
      },
      {
        // TODO: Need to get real data
        label: "Rent",
        data: [550, 400, 550, 450, 500], // MOCK DATA
        borderColor: "rgba(239, 68, 68, 1)",
        tension: 0.5,
      },
      {
        // TODO: Need to get real data
        label: "Groceries",
        data: [350, 500, 300, 400, 350], // MOCK DATA
        borderColor: "rgba(60, 216, 86, 1)",
        tension: 0.5,
      },
    ],
  };

  // TODO: Need to get real data
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 700, // set max?
      },
    },
  };

  return (
    // Outer wrapper (Box div)
    <div className="p-6 bg-white shadow-md rounded-lg w-[580px] h-[365px] relative">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Spending Insights
      </h2>

      {/* Inner div for the chart (Chart div) */}
      <div className="absolute top-12 left-0 right-0 bottom-0 m-5 ml-10">
        <Line data={data} options={options} className="w-full h-full" />
      </div>
    </div>
  );
};

export default SpendvsIncome;
