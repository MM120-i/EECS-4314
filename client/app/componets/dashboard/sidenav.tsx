import Link from "next/link";
import YuNeedMoneyLogo from "@/app/componets/YuneedMoney-logo";
import NavLinks from "@/app/componets/dashboard/nav-links";


export default function SideNav(){
    return (
        <div className="bg-white text-logo w-80 space-y-10 py-7 px-2">
          <YuNeedMoneyLogo/>
          <div className="px-7 space-y-5">
            <NavLinks/>
          </div>
          
        </div>
      );
}