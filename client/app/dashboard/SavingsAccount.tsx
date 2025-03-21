import React from "react";

const SavingsAccount = () => {
  // TODO: Need to get real data
  let savings: number | string = 5245; // hard coded for now
  const brokeLimit = 5001;

  const broke = () => {
    if (
      typeof savings !== "number" ||
      isNaN(savings) ||
      savings < 0 ||
      savings >= brokeLimit
    ) {
      return null;
    }

    return " (you're broke lmao)";
  };

  const displaySavings = (savings?: number) => {
    if (typeof savings !== "number" || isNaN(savings) || savings < 0) {
      return "N/A";
    }

    return "$" + savings;
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg h-[350px] w-full max-w-[650px] flex flex-col">
      <div className="flex items-start">
        <h2 className="text-xl font-bold text-gray-800">
          Savings Account {broke()}
        </h2>
      </div>

      <h1 className="text-9xl font-bold text-gray-900 mt-20 ml-20">
        {displaySavings(typeof savings === "number" ? savings : undefined)}
      </h1>
    </div>
  );
};

export default SavingsAccount;
