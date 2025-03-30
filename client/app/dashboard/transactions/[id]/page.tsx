import DragNDrop from "@/app/componets/transactions/uploadReceipt";
import ReceiptsTable from "@/app/componets/transactions/receipts-table";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
  const id = params.id;
    return (
        <div className="mt-20 md:mt-10 flex flex-col ">
            <ReceiptsTable id = {id}/>
        </div>
    )
}