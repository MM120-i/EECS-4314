import SettingsSidebar from "../SettingsSidebar";

export default function AccountSettings() {
  return (
    <div className="flex min-h-screen">
    {/* Main Content (Centered) */}
      <main className="flex flex-1 justify-center items-center">
        <p className="text-gray-500">Account settings will be added here.</p>
      </main>

      {/* Settings Sidebar (Right) */}
      <SettingsSidebar />
    </div>
  );
}
