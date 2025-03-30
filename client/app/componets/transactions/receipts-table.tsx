import {
  DeleteReceipt,
  DeleteTransaction,
  EditReceipt,
  EditTransaction,
} from "@/app/componets/transactions/buttons";
import { getReceipt } from "@/app/data/receipts";

export default async function ReceiptsTable({id} : {id: String}) {
  // Initialized
  const receipt = (await getReceipt(id))?.data

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-grey-50 p-2 md:pt-0">
          <div className="md:hidden">
            {receipt?.map((receipt) => (
              <div key={receipt._id} className="mb-1 w-full rounded-xl p-4">
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
                      <EditReceipt transId= {id} id={receipt._id} />
                      <DeleteReceipt transId= {id} id={receipt._id} />
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
                  Name
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Price
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {receipt?.map((receipt) => (
                <tr
                  key={receipt._id}
                  className="w-full border-b py-3 text-lg last-of-type:border-none "
                >
                  <td className="whitespace-nowrap px-4 py-3">~
                    {receipt.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {receipt.price}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {receipt.quantity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {receipt.totalPrice}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex justify-end gap-3">
                    <EditReceipt transId= {id} id={receipt._id} />
                    <DeleteReceipt transId= {id} id={receipt._id} />
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
