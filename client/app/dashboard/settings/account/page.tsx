"use client";

import { useState } from "react";
import SettingsSidebar from "../SettingsSidebar";

// ✅ Fake Plaid data
const mockAccounts = [
  {
    accountId: "1",
    name: "Plaid Checking",
    type: "depository",
    subtype: "checking",
    mask: "0000",
  },
  {
    accountId: "2",
    name: "Plaid Savings",
    type: "depository",
    subtype: "savings",
    mask: "1111",
  },
];

export default function AccountSettings() {
  const [showBankFields, setShowBankFields] = useState(false);
  const [bankAccounts] = useState(mockAccounts);
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
    alert("✅ Bank account details saved!");
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex flex-1 justify-center items-center">
        <div className="p-8 w-full max-w-lg bg-white shadow-md rounded-lg absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Account Settings
          </h1>

          {!showBankFields && (
            <p className="text-center text-sm text-gray-400 mb-4">
              ✅ {bankAccounts.length} account(s) found
            </p>
          )}

          {!showBankFields && (
            <button
              onClick={() => setShowBankFields(true)}
              className="w-full px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add Bank Account
            </button>
          )}

          {!showBankFields &&
            bankAccounts.map((account) => (
              <div
                key={account.accountId}
                className="p-4 border rounded bg-gray-100 text-sm mb-4"
              >
                <p className="font-medium mb-1">Connected Bank:</p>
                <p>Name: {account.name}</p>
                <p>
                  Type: {account.type} / {account.subtype}
                </p>
                <p>Account Ending: ****{account.mask}</p>
              </div>
            ))}

          {showBankFields && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Name on Card
              </label>
              <input
                type="text"
                name="name"
                value={bankDetails.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
              />

              <label className="block text-sm font-medium mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={bankDetails.cardNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
              />

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={bankDetails.cvv}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={bankDetails.expiryDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

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

      {/* Settings Sidebar */}
      <div className="fixed right-0 top-0 h-full">
        <SettingsSidebar />
      </div>
    </div>
  );
}
