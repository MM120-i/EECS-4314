'use client';

import { ChartPieIcon, Cog8ToothIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid"
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

const links = [
    {name:"Home", href:"/dashboard",icon:ChartPieIcon},
    {name:"Transactions", href:"/transactions",icon:CurrencyDollarIcon},
    {name:"settings", href:"/settings",icon:Cog8ToothIcon},
];

export default function NavLinks(){
    const pathname = usePathname();

    return(
        <>
        {links.map((link) => {
            const LinkIcon = link.icon;
            return(
                <Link
                    key={link.name}
                    href={link.href}
                    className={clsx("flex h-[48px] grow items-center justify-center gap-5 rounded-md  p-3 text-md font-medium hover:bg-red-100 hover:text-black-600 md:flex-none md:justify-start md:p-2 md:px-3",
                        {
                            "bg-red-600 text-white": pathname === link.href,
                        },                        
                    )}
                >
                    <LinkIcon className="w-6"/>
                    <p className="hidden md:block">{link.name}</p>
                </Link>
            )
        })}
        </>
    )
}