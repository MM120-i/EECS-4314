"use client"; // Required for interactive components

import { useRouter } from "next/navigation";
import SettingsSidebar from "../SettingsSidebar";

export default function DeleteAccount() {
  const router = useRouter();

  const handleDelete = () => {
    // Redirect to login page after deleting account
    router.push("/login");
  };

  const handleCancel = () => {
    // Redirect back to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content (Fully Centered) */}
      <main className="flex flex-1 justify-center items-center">
        <div className="p-6 w-full max-w-md bg-white shadow-md rounded-lg text-center">
          <h1 className="text-2xl font-semibold mb-4 text-red-600">Delete Account</h1>
          <p className="text-lg text-gray-700 mb-4">
            Are you sure you want to delete this account?
          </p>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Yes, Delete
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              No, Cancel
            </button>
          </div>
        </div>
      </main>

      {/* Settings Sidebar (Right) */}
      <SettingsSidebar />
    </div>
  );
}
