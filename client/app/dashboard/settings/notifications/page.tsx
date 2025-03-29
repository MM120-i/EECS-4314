"use client"; // Required for interactive components

import { useState } from "react";
import SettingsSidebar from "../SettingsSidebar";

export default function NotificationsSettings() {
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Main Content (Fully Centered) */}
      <main className="flex flex-1 justify-center items-center">
        <div className="p-6 w-full max-w-md bg-white shadow-md rounded-lg absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-semibold mb-4 text-center">Notifications</h1>

          {/* Toggle Label & Switch */}
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-700">
              Do you want to turn the notifications on?
            </span>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isNotificationsOn}
                onChange={() => setIsNotificationsOn(!isNotificationsOn)}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
                  isNotificationsOn ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    isNotificationsOn ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </div>
            </label>
          </div>
        </div>
      </main>

      {/* Settings Sidebar (Right) */}
      <SettingsSidebar />
    </div>
  );
}
