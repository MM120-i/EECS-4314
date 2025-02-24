import { transactions } from "@/app/lib/placeholder-data"
import TransactionCategory from "@/app/componets/transactions/category"
import { DeleteTransaction, EditTransaction, ViewTransaction } from "@/app/componets/transactions/buttons"

export default async function TransactionsTable() {
    // const transactions = ; get data from DB later

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div>
                    {/* <div>
                     {transactions?.map( transaction => (
                        <div key={transaction.id}>
                            <p>{transaction.date}</p>
                            <p className="text-sm text-gray-500">{transaction.descrption}</p>
                        </div>
                     ))}
                    </div> */}
                    <table className="hidden min-w-full text-grey-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
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
                            {transactions?.map(transaction => (
                                <tr 
                                    key={transaction.id}
                                    className="w-full border-b py-3 text-lg last-of-type:border-none"
                                    >
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {transaction.date}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {transaction.descrption}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <TransactionCategory category={transaction.category} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {transaction.amount}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <div className="flex justify-end gap-3">
                                        <ViewTransaction id={transaction.id}/>
                                        <EditTransaction id={transaction.id}/>
                                        <DeleteTransaction id={transaction.id}/>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}