'use client';

import { useContext } from "react";
import YuNeedMoneyLogo from "../YuneedMoney-logo";
import Link from "next/link";
import { string } from "zod";

export default function TopNav({name, email, profilePic}: {name:string, email:string, profilePic:string}) {
    console.log(name)

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <YuNeedMoneyLogo text_color='white' />
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
                    <Link href={'dashboard/profile'} className="flex gap-2 items-center">
                        <span className="text-white text-md">Welcome {name}!</span>
                        <img className="w-10 h-10 rounded-full" src='/profile.gif' alt="user photo" />
                        
                    </Link>
                        
                </div>
            </div>
        </nav>
    )
}