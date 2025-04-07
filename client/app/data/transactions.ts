"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Categories } from "../lib/categories";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const cats = Categories.map((cat) => cat.label) as [string, ...string[]];

const FormSchema = z.object({
  description: z
    .string()
    .min(2, { message: "transaction name must be at least 2 characters long." })
    .trim(),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  category: z.enum(cats, {
    invalid_type_error: "Please select an category type.",
  }),
  date: z.date({ invalid_type_error: "Please select a date" }),
});

export async function getTransactions() {
  try {
    const token = (await cookies()).get("session")?.value;
    const response = await axios.get(`${BACKEND_URL}/user/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { ok: true, data: response.data.transactions };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { ok: false, data: error.response.data };
    }
    return { ok: false, data: "An unknown error occurred." };
  }
}

// Define or import the State type
type State = {
  // Add appropriate fields for the State type
  transactions: Array<any>;
};

export async function createTransaction(prevState: any, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = FormSchema.safeParse({
    date: formData.get("date")
      ? new Date(formData.get("date") as string)
      : null,
    description: formData.get("name"),
    category: formData.get("category"),
    amount: formData.get("amount"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { date, description, category, amount } = validatedFields.data;
  console.log({ date, description, category, amount });

  // Insert data into the database
  try {
    const token = (await cookies()).get("session")?.value;
    const response = await axios.post(
      `${BACKEND_URL}/transactions/create`,
      { date, description, category, amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: `${error}`,
    };
  }

  revalidatePath("/dashboard/transactions");
  redirect("/dashboard/transactions");
}

export async function deleteTransaction(id: string) {
  try {
    const token = (await cookies()).get("session")?.value;
    const response = await axios.delete(`${BACKEND_URL}/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return {
      message: `${error}`,
    };
  }
  revalidatePath("/dashboard/transactions");
}

export async function getForecast() {
  try {
    const token = (await cookies()).get("session")?.value;
    const response = await axios.get(`${BACKEND_URL}/user/category/forecast`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === "Success") {
      return { ok: true, data: response.data.data.forecastData };
    } else {
      return { ok: false, data: "Unexpected status in response." };
    }
  } catch (error) {
    return { message: `${error}` };
  }
}
