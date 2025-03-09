import { poppins } from "@/app/componets/fonts";
import { AddTransnaction } from "@/app/componets/transactions/buttons";
import Table from '@/app/componets/transactions/transaction-table';

export default function Page() {
    return (
        <div className="w-full">
            <div className="">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${poppins.className} text-2xl`}>Transactions</h1>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2 md:mt-8">
                    <AddTransnaction />
                </div>
            </div>
            <Table />
            {/* pagination goes here */}
        </div>
    );
}