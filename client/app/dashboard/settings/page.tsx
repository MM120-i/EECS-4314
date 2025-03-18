import SideNav from "@/app/componets/dashboard/sidenav";
import SettingsSidebar from "./SettingsSidebar";
import { redirect } from "next/navigation";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

export default function SettingsPage() {
  
  redirect("/dashboard/settings/profile"); // Instantly redirects
  return null;
}
