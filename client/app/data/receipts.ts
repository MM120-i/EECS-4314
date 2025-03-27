'use server'

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function uploadReceipt(formData: FormData) {
    const token = (await cookies()).get("session")?.value;
   const res =  await fetch(`${BACKEND_URL}/receipt/process`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    });
    return await (res.ok, res.json())
}

