"use client"; // Fixes usePathname() error

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-100 p-6 fixed right-0 top-0 h-full flex flex-col justify-center space-y-4">
      <ul className="space-y-6">
        <li>
          <Link
            href="/dashboard/settings/profile"
            className={`block p-3 rounded transition duration-200 ${
              pathname === "/dashboard/settings/profile"
                ? "bg-gray-300"
                : "hover:bg-gray-200"
            }`}
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/settings/account"
            className={`block p-3 rounded transition duration-200 ${
              pathname === "/dashboard/settings/account"
                ? "bg-gray-300"
                : "hover:bg-gray-200"
            }`}
          >
            Account
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/settings/notifications"
            className={`block p-3 rounded transition duration-200 ${
              pathname === "/dashboard/settings/notifications"
                ? "bg-gray-300"
                : "hover:bg-gray-200"
            }`}
          >
            Notifications
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/settings/delete"
            className={`block p-3 rounded transition duration-200 ${
              pathname === "/dashboard/settings/delete"
                ? "bg-gray-300"
                : "hover:bg-gray-200"
            }`}
          >
            Delete Account
          </Link>
        </li>
      </ul>
    </div>
  );
}
