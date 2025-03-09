'use server';

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { env } from "process";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return error.message;
        }
      }
      throw error;
    }
  }

 //create user
  export async function register(
      prevState: string | undefined,
      formData: FormData,
  ){
    const credentials = {
    name:formData.get('name'),
    email:formData.get('email'),
    password:formData.get('password'),
    }
    try{
      const res = await fetch(`${env.BACKEND_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" }
      })
      const user = res.json()
      
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return error.message;
        }
      }
      throw error;
    }
    redirect('/dashboard')
  }

  // useEffect(() => {

  //   setData(result);
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/lib/mockdata");
  //       const result: Record<string, SpendCategory> = mockdata;
        
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  
  // setData(mockdata);