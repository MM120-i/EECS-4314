import DragNDrop from "@/app/componets/transactions/drag-drop";
import TransactionsTable from "@/app/componets/transactions/transaction-table";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    return (
        <div>
            this is {id};
            <DragNDrop/>
            <TransactionsTable/>
        </div>
    )
}