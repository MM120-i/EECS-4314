'use client';
import React, { useState, useEffect } from "react";

type SpendCategory = {
  amount: string;
  label: string;
  comment: string;
  icon: string;
  bgColor: string;
};

const WeeklySpend = () => {
  const [data, setData] = useState<Record<string, SpendCategory>>({});

  // Define hardcoded data for labels, colors, and boxes
  const categories = [
    { id: "totalSpent", label: "Total Spent", bgColor: "bg-red-100" },
    { id: "groceries", label: "On Groceries", bgColor: "bg-yellow-100" },
    { id: "eatingOut", label: "Times Eaten Out", bgColor: "bg-green-100" },
    { id: "entertainment", label: "On Entertainment", bgColor: "bg-purple-100" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/mockdata.json");
        const result: Record<string, SpendCategory> = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Weekly Spend</h2>
          <p className="text-gray-500 text-sm">Weekly Summary</p>
        </div>
        <button className="border px-4 py-2 text-sm rounded-md shadow-sm">
          Export
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {categories.map((category) => {
          const item = data[category.id];
          if (!item) return null;

          return (
            <div
              key={category.id}
              className={`p-4 rounded-lg shadow-sm ${category.bgColor}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="text-lg font-bold mt-2">{item.amount}</h3>
              <p className="text-gray-700">{category.label}</p>
              <p className="text-sm text-gray-500">{item.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySpend;
