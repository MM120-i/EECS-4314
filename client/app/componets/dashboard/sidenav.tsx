import YuNeedMoneyLogo from "@/app/componets/YuneedMoney-logo";
import NavLinks from "@/app/componets/dashboard/nav-links";


export default function SideNav() {
  return (
    <div className="bg-white text-logo w-full md:w-80 space-y-10 py-7 px-2 md:sticky md:h-full md:top-0">
    <YuNeedMoneyLogo/>
    <div className="md:px-7 space-y-5">
      <NavLinks/>
    </div>
    
  </div>
  );
}