"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const FormSchema = z.object({
    description: z.string().min(2, { message: "transaction name must be at least 2 characters long." }).trim(),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    category: z.enum(["Grocery", "idk", "option2"], {
      invalid_type_error: 'Please select an category type.',
    }),
    date: z.date({invalid_type_error: 'Please select a date'}),
  });


export async function getTransactions() {
    try{
        const token = (await cookies()).get("session")?.value;
        const response = await axios.get(`${BACKEND_URL}/user/transactions`, {headers: {
        Authorization: `Bearer ${token}`, 
        }})

        console.log({ok:true, data:response.data.transactions})
        return {ok:true, data:response.data.transactions}
    }
    catch(error){
        console.log({ok:false, data: error})
        // return {ok:false, data: error.response.data}
        
    }
}


export async function createTransaction(prevState: State, formData: FormData) {
    // Validate form fields using Zod
    const validatedFields = FormSchema.safeParse({
        date: new Date(formData.get('date')),
        description: formData.get('name'), 
        category: formData.get("category"),
        amount: formData.get("amount")
    });
  
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
  
    // Prepare data for insertion into the database
    const { date, description, category,amount } = validatedFields.data;
    console.log({ date, description, category,amount });
    
  
    // Insert data into the database
    try {
        const token = (await cookies()).get("session")?.value;
        const response = await axios.post(`${BACKEND_URL}/api/transactions/create`, {date, description, category, amount}, {headers: {
            Authorization: `Bearer ${token}`, 
            }})

    } catch (error) {
      // If a database error occurs, return a more specific error.
      return {
        message: `${error}`,
      };
    }
  
    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/transactions');
    redirect('/dashboard/transactions');
  }