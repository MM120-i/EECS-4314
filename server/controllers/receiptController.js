// Functions
import scanReceipt from "../services/taggun.js";
import Transaction from "../models/Transaction.js";

import { categorizeTransaction } from "../services/openai.js";

// Models
import User from "../models/User.js";

const processReceipt = async (req, res) => {
  try {
    // If the file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "Error", message: "No receipt image provided" });
    }

    // Calling Taggun API
    const receiptData = await scanReceipt(req.file);

    console.log("Taggun API response:", JSON.stringify(receiptData, null, 2));

    // return raw data from Taggun
    res.status(200).json({
      message: "Receipt processed successfully",
      data: receiptData,
    });
  } catch (err) {
    console.error("Receipt processing error:", err);
    res
      .status(500)
      .json({ message: "Error processing receipt", error: err.messsage });
  }
};

// Creating a new Transaction for structured response
const createReceiptTransaction = async (req, res) => {
  try {
    // If the file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "Error", message: "No receipt image provided" });
    }

    // get user id
    const userId = req.user?.id || req.query.userId;
    console.log("The user id: " + userId);

    // Calling Taggun API
    const receiptData = await scanReceipt(req.file);
    // console.log(JSON.stringify(receiptData, null, 2));

    // Extracting data from Taggun response
    const transactionData = new Transaction({
      userId: userId,
      type: "expense", // default to expense
      amount: receiptData.totalAmount?.data,
      category: req.body.category || "Uncategorized",
      tax: receiptData.taxAmount?.data,
      date: receiptData.date?.data,
      merchantName: receiptData.merchantName?.data,
      merchantAddress: receiptData.merchantAddress?.data,
      items:
        receiptData.amounts
          ?.filter(
            (item) =>
              item.index <
              receiptData.amounts.findIndex((a) =>
                a.text?.toLowerCase().includes("subtotal")
              )
          )
          .map((item) => ({
            name: cleanItemNames(item.text),
            price: item.data,
            quantity: 1,
            totalPrice: item.data,
          })) || [],
    });

    // ok so now we can actually use this ai thing to categorize the transaction ykwim or no?
    const categoryBasedOnAi = await categorizeTransaction(transactionData);

    // ok now we can save the transaction and hope it works properly
    const transaction = new Transaction({
      userId: userId,
      type: "expense",
      amount: transactionData.amount,
      category: categoryBasedOnAi, // Use the AI-determined category
      tax: transactionData.tax,
      date: transactionData.date,
      merchantName: transactionData.merchantName,
      merchantAddress: transactionData.merchantAddress,
      items: transactionData.items,
    });

    // and BOOM this shi works I think

    const savedTransaction = await transaction.save();
    console.log("Saved transaction:", savedTransaction.userId);

    // Also need to add the transaction to the user object
    await User.findByIdAndUpdate(userId, {
      $push: { transactions: savedTransaction._id },
    });

    res.status(201).json({
      status: "Success",
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (err) {
    console.error("Receipt transaction creation error:", err);
    res.status(500).json({
      status: "Error",
      message: "Failed to create transaction from receipt",
      error: err.message,
    });
  }
};

function cleanItemNames(item) {
  if (!item) return "";

  return item.split(/\s+\d{6,}|\s+[A-Z]\s+\d+\.\d+/)[0].trim();
}

export default { processReceipt, createReceiptTransaction };
