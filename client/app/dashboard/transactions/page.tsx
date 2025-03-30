import { poppins } from "@/app/componets/fonts";
import { AddTransnaction } from "@/app/componets/transactions/buttons";
import TransactionsTable from "@/app/componets/transactions/transaction-table";
import UploadReceipt from "@/app/componets/transactions/uploadReceipt";

export default function Page() {
    return (
        <div className="w-full">
            <div className="">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${poppins.className} text-2xl`}>Transactions</h1>
                </div>
                <div className="mt-4 flex justify-end gap-2 md:mt-8">
                    <UploadReceipt/>
                    <AddTransnaction />
                </div>
            </div>
            <TransactionsTable />
            {/* pagination goes here */}
        </div>
    );
}