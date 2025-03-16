"use client";

import { poppins } from "../componets/fonts";
import WeeklySpend from "./WeeklySpend";
import SavingsAccount from "./SavingsAccount";
import TransactionCategory from "../componets/transactions/category";
import SpendvsIncome from "./SpendvsIncome";
import SpendingInsights from "./SpendingInsights";
import MostDrainingSpends from "./MostDrainingSpends";
import { useContext } from "react";
// import { AuthContext } from "../lib/authContext";

export default function Page() {
  return (
    <main className="overflow-x-hidden">
      <h1 className={`${poppins.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      {/* Flexbox container for the widgets */}
      <div className="p-6 bg-gray-100 flex flex-wrap gap-4 justify-start">
        {/* WeeklySpend (make it wider using pixel width) */}
        <div className="h-[400px] w-full sm:w-[800px] lg:w-[965px] bg-gray-100 rounded-lg p-4 mb-4">
          {" "}
          {/* Adjusted margin-bottom here */}
          <WeeklySpend />
        </div>

        {/* SpendingInsights */}
        <div className="h-[350px] w-full sm:w-[500px] lg:w-[500px] bg-gray-100 rounded-lg p-4 mb-4">
          <SpendingInsights />
        </div>

        {/* SavingsAccount */}
        <div className="h-[350px] w-full sm:w-[700px] lg:w-[665px] bg-gray-100 rounded-lg p-4 mb-4">
          <SavingsAccount />
        </div>

        {/* SpendvsIncome */}
        <div className="h-[350px] w-full sm:w-[500px] lg:w-[500px] bg-gray-100 rounded-lg p-4 mb-4">
          <SpendvsIncome />
        </div>

        {/* MostDrainingSpends */}
        <div className="h-[350px] w-full sm:w-[500px] lg:w-[800px] bg-gray-100 rounded-lg p-4 mb-20">
          <MostDrainingSpends />
        </div>
      </div>
    </main>
  );
}
