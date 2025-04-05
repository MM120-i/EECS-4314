import { transactions } from "@/app/lib/placeholder-data";
import TransactionCategory from "@/app/componets/transactions/category";
import {
  DeleteReceipt,
  DeleteTransaction,
  EditTransaction,
  ViewTransaction,
} from "@/app/componets/transactions/buttons";
import { getTransactions } from "@/app/data/transactions";

interface Transaction {
  _id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: string;
}

export default async function TransactionsTable() {
  const transactions = (await getTransactions())?.data;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-grey-50 p-2 md:pt-0">
          <div className="md:hidden">
            {transactions?.map((transaction: Transaction) => (
              <div key={transaction._id} className="mb-1 w-full rounded-xl p-4">
                <div className="flex items-center border-b pb-4 gap-5">
                  <div className="mb-2 flex items-center">
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-md">{transaction.description}</p>
                      <p className="text-md font-medium">
                        {transaction.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </p>
                    </div>
                    <TransactionCategory category={transaction.category} />
                    <div className="flex  gap-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-grey-900 md:table">
            <thead className="rounded-lg text-left text-lg font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Description
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Category
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {transactions?.map((transaction: Transaction) => (
                <tr
                  key={transaction._id}
                  className="w-full border-b py-3 text-lg last-of-type:border-none"
                >
                  <td className="whitespace-nowrap px-3 py-3 text-sm">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm">
                    {transaction.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm">
                    <TransactionCategory category={transaction.category} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm ">
                    {transaction.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex justify-end gap-3">
                      {transaction?.type === "Receipt" && (
                        <>
                          <ViewTransaction id={transaction._id} />
                          <DeleteReceipt id={transaction._id} />
                        </>
                      )}
                      {transaction?.type !== "Receipt" && (
                        <>
                          <ViewTransaction id={transaction._id} />
                          <DeleteTransaction id={transaction._id} />
                          <EditTransaction id={transaction._id} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
