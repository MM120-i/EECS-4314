'use server';

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
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
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }

  export async function register(
      prevState: string | undefined,
      formData: FormData,
  ){
    const credentials = {
    name:formData.get('name'),
    email:formData.get('email'),
    password:formData.get('password'),
    }

    //create user 
    try{
      const res = await fetch(`${env.BACKEND_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" }
      })
      console.log(res,JSON.stringify(credentials))
      const user = res.json()
      
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }