"use client";

import { poppins } from "../componets/fonts";
import WeeklySpend from "./WeeklySpend";
import SavingsAccount from "./SavingsAccount";
import SpendvsIncome from "./SpendvsIncome";
import SpendingInsights from "./SpendingInsights";
import MostDrainingSpends from "./MostDrainingSpends";
import ForecastDisplay from "./ForecastDisplay";

export default function Page() {
  return (
    <main className="overflow-x-hidden">
      <h1 className={`${poppins.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="p-6 bg-gray-100 flex flex-wrap gap-4 justify-start">
        <div className="flex gap-4 w-full lg:w-auto flex-wrap">
          <WeeklySpend />
          <SpendingInsights />
        </div>

        <div className="flex flex-wrap gap-4 w-full">
          <SavingsAccount />
          <SpendvsIncome />
        </div>

        <div className="flex flex-wrap gap-4 w-full">
          <div className="w-full sm:w-[400px] md:w-[600px] lg:w-[750px]">
            <MostDrainingSpends />
          </div>
          <div className="w-full sm:w-[400px] md:w-[600px] lg:w-[776px]">
            <ForecastDisplay />
          </div>
        </div>
      </div>
    </main>
  );
}
