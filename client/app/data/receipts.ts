"use server";
import { ok } from "assert";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function uploadReceipt(formData: FormData) {
  try {
    const token = (await cookies()).get("session")?.value;
    let res = null;
    let err = null;
    const response = await axios.post(
      `${BACKEND_URL}/receipt/transaction`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    revalidatePath("/dashboard/transactions");
    return { ok: true, data: response.data.data.items };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { ok: false, data: error.response.data };
    }
    return { ok: false, data: "An unknown error occurred" };
  }
}

export async function getReceipt(transactionID: String) {
  try {
    const token = (await cookies()).get("session")?.value;
    let res = null;
    let err = null;
    const response = await axios.get(
      `${BACKEND_URL}/user/transactions/${transactionID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log({ ok: true, data: response.data.items });
    return { ok: true, data: response.data.items };
  } catch (error) {
    console.log({ ok: false, data: error });
    // return {ok:false, data: error.response.data}
  }
}

export async function deleteReceipt(id: string, transId: string) {
  try {
    const token = (await cookies()).get("session")?.value;
    const response = await axios.delete(`${BACKEND_URL}/receipt/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return {
      message: `${error}`,
    };
  }
  revalidatePath(`/dashboard/transactions/${transId}`);
}
