"use client"; // Required for interactive components

import { useState } from "react";
import SettingsSidebar from "../SettingsSidebar";

export default function AccountSettings() {
  const [showBankFields, setShowBankFields] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    name: "",
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Bank account details saved!");
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content (Fully Centered) */}
      <main className="flex flex-1 justify-center items-center">
        <div className="p-6 w-full max-w-md bg-white shadow-md rounded-lg absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-semibold mb-4 text-center">Account Settings</h1>

          {/* Ensure Button is Always Visible */}
          <button
            onClick={() => setShowBankFields(true)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Bank Account
          </button>

          {/* Show Input Fields When Button is Clicked */}
          {showBankFields && (
            <div className="mt-4">
              {/* Name on Card */}
              <label className="block text-gray-700 text-sm font-bold mb-1">Name on Card</label>
              <input
                type="text"
                name="name"
                value={bankDetails.name}
                onChange={handleInputChange}
                placeholder="Enter name on card"
                className="w-full p-2 border rounded"
              />

              {/* Card Number */}
              <label className="block text-gray-700 text-sm font-bold mt-4 mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={bankDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="Enter card number"
                className="w-full p-2 border rounded"
              />

              {/* CVV & Expiry Date */}
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-bold mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={bankDetails.cvv}
                    onChange={handleInputChange}
                    placeholder="CVV"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-bold mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={bankDetails.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Settings Sidebar (Right) */}
      <SettingsSidebar />
    </div>
  );
}
