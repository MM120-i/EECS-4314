import axios from "axios";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


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