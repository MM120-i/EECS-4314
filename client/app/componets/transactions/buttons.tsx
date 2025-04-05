"use client";

import { deleteReceipt } from "@/app/data/receipts";
import { deleteTransaction } from "@/app/data/transactions";
import {
  TrashIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export function AddTransnaction() {
  return (
    <Link
      href="/dashboard/transactions/add"
      className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white"
    >
      <span className="hidden md:block">Add Transaction</span>
      <PlusIcon className="h-5 md:ml-5" />
    </Link>
  );
}

export function EditTransaction({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/transactions/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteTransaction({ id }: { id: string }) {
  const DeleteTransactionWithId = deleteTransaction.bind(null, id);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await DeleteTransactionWithId();
      }}
    >
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function ViewTransaction({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/transactions/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5"></EyeIcon>
    </Link>
  );
}

export function EditReceipt({ id, transId }: { id: string; transId: string }) {
  return (
    <Link
      href={`/dashboard/transactions/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteReceipt({ id }: { id: string }) {
  const DeleteReceiptWithId = deleteReceipt.bind(null, id);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await DeleteReceiptWithId(id);
      }}
    >
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
