import { TrashIcon,EyeIcon } from "@heroicons/react/24/outline"
import { PencilIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

export function AddTransnaction() {
    return (
        <></>
        // TODO
    )
}

export function EditTransaction({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/transactions/${id}`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5"/>
        </Link>
    )
}

export function DeleteTransaction({ id }: { id: string }) {
    return (
        <form action="">
            <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
                <TrashIcon className="w-5"/>

            </button>
        </form>
    )
}

export function ViewTransaction({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/transactions/${id}`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <EyeIcon className="w-5"></EyeIcon>
        </Link>
    )
}