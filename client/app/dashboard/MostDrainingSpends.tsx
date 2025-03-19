import React from "react";

interface SpendData {
  id: number;
  name: string;
  drain: number;
}

// NEED TO MAKE THIS ORDER BUT THATS FOR LATER

const MostDrainingSpends = () => {
  const data: SpendData[] = [
    // TODO: Need to get real data
    // MOCK DATA
    { id: 1, name: "Subscription Service", drain: 0.4 },
    { id: 2, name: "Eating Out", drain: 0.6 },
    { id: 3, name: "Groceries", drain: 0.8 },
    { id: 4, name: "Entertainment", drain: 0.3 },
    { id: 5, name: "Shopping", drain: 0.9 },
  ];

  const getColor = (drain: number): string => {
    if (drain <= 0.25) {
      return "bg-green-500"; // Green for 0-25%
    }

    if (drain <= 0.5) {
      return "bg-yellow-500"; // Yellow for 26-50%
    }

    if (drain <= 0.75) {
      return "bg-orange"; // Orange for 51-75%
    }

    if (drain > 0.75) {
      return "bg-red-500"; // Red for 76%-100%
    }

    return "";
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Most Draining Spends
      </h2>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">#</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Drain</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.id}</td>
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">
                <div className="relative w-32">
                  <div
                    className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs"
                    style={{ textShadow: "1px 1px 2px black" }}
                  >
                    {Math.round(item.drain * 100)}%
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-200">
                    <div
                      style={{ width: `${item.drain * 100}%` }}
                      className={`h-full rounded-full ${getColor(item.drain)}`}
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MostDrainingSpends;
