'use client';

import { poppins } from "../componets/fonts";
import WeeklySpend from "./WeeklySpend";
import SavingsAccount from "./SavingsAccount";
import TransactionCategory from "../componets/transactions/category";
import { useContext } from "react";
import { AuthContext } from "../lib/authContext";


export default function Page() {
    return (
        <main>
            <h1 className={`${poppins.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
               {/* <Suspense fallback={<CardsSkeleton/>}>
                    <CardWrapper/>
               </Suspense> */}
            </div>

            {/* Apply flex-col to stack items vertically */}
            <div className="p-10 bg-gray-100 min-h-screen flex flex-col gap-6">
                <div className="w-full max-w-4xl h-[290px] bg-gray shadow-md rounded-lg">
                    <WeeklySpend />
                </div>
                <div>
                    <SavingsAccount />
                </div>
            </div>
        </main>
    );
}
