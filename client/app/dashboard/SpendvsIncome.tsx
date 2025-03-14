import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const SpendvsIncome = () => {
  const data = { //chart data
    labels: ['January', 'February', 'March', 'April', 'May'], // x-axis labels
    datasets: [
      {
        label: 'Spending', 
        data: [500, 600, 700, 800, 650], // // MOCK DATA
        borderColor: 'rgba(0, 149, 255, 1)', 
      },
      {
        label: 'Income', 
        data: [800, 850, 950, 1000, 1200], 
        borderColor: 'rgba(7, 224, 152, 1)', 
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true, 
    plugins: {
      legend: {
        position: 'bottom', 
      },
    },
    scales: {
      y: {
        beginAtZero: true, 
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-[600px] h-[350px] relative">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Spending vs Income</h2>

      {/*Chart div */}
      <div className="absolute top-12 left-0 right-0 bottom-0 m-5 ml-8">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SpendvsIncome;
