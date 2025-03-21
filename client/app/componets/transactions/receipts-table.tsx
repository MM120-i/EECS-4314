import {
  DeleteTransaction,
  EditTransaction,
} from "@/app/componets/transactions/buttons";

export default async function ReceiptsTable() {
  // Initialized
  const receipts: {
    id: string;
    date: string;
    descrption: string;
    amount: string;
  }[] = [];

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-grey-50 p-2 md:pt-0">
          <div className="md:hidden">
            {receipts?.map((receipt) => (
              <div key={receipt.id} className="mb-1 w-full rounded-xl p-4">
                <div className="flex items-center border-b pb-4 gap-5">
                  <div className="mb-2 flex items-center">
                    <p className="text-sm text-gray-500">{receipt.date}</p>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">{receipt.amount}</p>
                      <p className="text-lg">{receipt.descrption}</p>
                    </div>
                    <div className="flex  gap-2">
                      <EditTransaction id={receipt.id} />
                      <DeleteTransaction id={receipt.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-grey-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Item Description
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {receipts?.map((receipt) => (
                <tr
                  key={receipt.id}
                  className="w-full border-b py-3 text-lg last-of-type:border-none"
                >
                  <td className="whitespace-nowrap px-3 py-3">
                    {receipt.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {receipt.descrption}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {receipt.amount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex justify-end gap-3">
                      <EditTransaction id={receipt.id} />
                      <DeleteTransaction id={receipt.id} />
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
