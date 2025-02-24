import { poppins } from "@/app/componets/fonts";
import Table from '@/app/componets/transactions/table';

export default function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${poppins.className} text-2xl`}>Transactions</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                {/* add transaction button goes here */}
            </div>
            <Table/>
                {/* pagination goes here */}
        </div>
    );
}