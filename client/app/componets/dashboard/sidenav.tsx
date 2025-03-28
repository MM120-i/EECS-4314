import { logOut } from "@/app/auth/actions";
import NavLinks from "@/app/componets/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function SideNav() {
  return (
    <div className="bg-white text-logo fixed w-full md:top-16  md:h-full md:py-7 md:px-2 md:space-y-10 md:z-10 md:w-60 md:sticky">
      <div className="md:px-7 md:space-y-5 ">
        <NavLinks />

        <div className="py-2.5 px-4 hover:bg-primary rounded-xl">
          <form
            action={async () => {
              "use server";
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
