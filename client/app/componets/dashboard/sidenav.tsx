import { logOut } from "@/app/auth/actions";
import YuNeedMoneyLogo from "@/app/componets/YuneedMoney-logo";
import NavLinks from "@/app/componets/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function SideNav() {
  return (
    <div className="bg-white text-logo w-80 fixed top-16 left-0 h-full py-7 px-2 space-y-10 z-10 md:w-80 md:sticky">
      <div className="md:px-7 pt-3 space-y-5">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div className="py-2.5 px-4 hover:bg-primary rounded-xl">
          <form
            action={async () => {
              'use server';
              await logOut();
            }}
          >
            <button className="flex space-x-3">
              <PowerIcon className="w-8" />
              <div className="hidden md:block text-[18px]">Sign Out</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
