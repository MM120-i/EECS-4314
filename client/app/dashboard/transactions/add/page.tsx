"use client";

import { Button } from "@/app/componets/button";
import TransactionCategory from "@/app/componets/transactions/category";
import { createTransaction } from "@/app/data/transactions";
import { Categories } from "@/app/lib/categories";
import { CalendarDateRangeIcon, ChartPieIcon, CheckIcon, ClockIcon, CurrencyDollarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Link, MenuItem, Select, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { List } from "postcss/lib/list";
import { useActionState, useState } from "react";

export default function Page() {

    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(createTransaction, initialState);
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [amount, setAmount] = useState('')


    return (
        <div className="mt-20">
            <form action={formAction}>
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    {/* Transaction Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="mb-2 block text-sm font-medium">
                            Transaction description
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="description"
                                    name="name"
                                    type="text"
                                    step="0.01"
                                    placeholder="Enter Transaction name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    aria-describedby="name-error"
                                />
                                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>

                        <div id="description-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.description &&
                                state.errors.description.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    {/* Transaction Amount */}
                    <div className="mb-4">
                        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                            Enter an amount
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="Enter USD amount"
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    aria-describedby="amount-error"
                                />
                                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>

                        <div id="amount-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.amount &&
                                state.errors.amount.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    {/* Transaction Category */}
                    <div className="mb-4">
                        <label htmlFor="category" className="mb-2 block text-sm font-medium">
                            Choose an Category
                        </label>
                        <div className="relative">
                            <Select
                               name="category"
                                id="demo-simple-select"
                                value={category}
                                label="category"
                                onChange={e => setCategory(e.target.value)}
                                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            >   
                            {Categories.map((cat, index) => (
                                <MenuItem key={index} value={cat.label}><TransactionCategory category={cat.label}></TransactionCategory></MenuItem>
                            ))}
                            </Select>
                            <ChartPieIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>

                        <div id="amount-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.category &&
                                state.errors.category.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>


                    {/* Transaction Date */}
                    <div className="mb-4">
                        <label htmlFor="date" className="mb-2 block text-sm font-medium">
                            Pick a Date
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    placeholder="Select a date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    aria-describedby="date-error"
                                />
                                <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>
                        <div id="date-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.date &&
                                state.errors.date.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div aria-live="polite" aria-atomic="true">
                        {state.message ? (
                            <p className="mt-2 text-sm text-red-500">{state.message}</p>
                        ) : null}
                    </div>

                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link
                        href="/dashboard/transactions"
                        className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                    >
                        <Button type="button">Cancel</Button>
                    </Link>
                    <Button type="submit">Create Invoice</Button>
                </div>
            </form>
        </div>
    );
}