import React, { useState, useEffect } from "react";
import { getForecast } from "@/app/data/transactions";

const ForecastDisplay = () => {
  interface ForecastItem {
    category: string;
    forecast: string;
  }

  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      const result = await getForecast();

      if (result.ok) {
        setForecastData(result.data);
      } else {
        setError(result.data);
      }
    };

    fetchForecastData();
  }, []);

  const displayForecast = (forecast: string) => {
    if (typeof forecast !== "string" || isNaN(parseFloat(forecast))) {
      return "N/A";
    }

    return "$" + parseFloat(forecast).toFixed(2);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg h-[386px] w-full max-w-[800px] flex flex-col">
      <div className="flex items-start">
        <h2 className="text-xl font-bold text-gray-800">
          Forecast for Next Month
        </h2>
      </div>

      {error ? (
        <div className="text-red-500 mt-4 text-sm">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="mt-4">
          {forecastData.length > 0 ? (
            forecastData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  {item.category}
                </h3>
                <p className="text-xl font-bold text-gray-900">
                  {displayForecast(item.forecast)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No forecast data available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ForecastDisplay;
