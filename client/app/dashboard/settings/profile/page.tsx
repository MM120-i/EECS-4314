"use client"; // Required for interactive components

import { useState } from "react";
import SettingsSidebar from "../SettingsSidebar"; // Import the Settings Sidebar

export default function ProfileSettings() {
  // User state (Email is read-only, username is editable)
  const [user, setUser] = useState({
    email: "user@example.com",
    username: "User123",
  });

  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content (Centered Between Sidebars) */}
      <main className="flex flex-1 justify-center items-center">
        <div className="p-8 w-full max-w-lg bg-white shadow-md rounded-lg absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-semibold mb-4 text-center">Account Settings</h1>

          {/* Email (Read-Only) */}
          <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />

          {/* Editable Username */}
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-1">Username</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="w-full p-2 border rounded"
          />

          {/* Password Input */}
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-2 border rounded"
          />

          {/* Edit Profile Button */}
          <button
            onClick={handleUpdateProfile}
            className="mt-4 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      </main>

      {/* Fix Settings Sidebar on the Right */}
      <div className="fixed right-0 top-0 h-full">
        <SettingsSidebar />
      </div>
    </div>
  );
}
