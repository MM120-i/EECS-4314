import scanReceipt from "../services/taggun.js";
import Transaction from "../models/Transaction.js";

const processReceipt = async (req, res) => {
  try {
    // If the file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No receipt image provided" });
    }

    // Calling Taggun API
    const receiptData = await scanReceipt(req.file);

    // return raw data from Taggunz
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
      return res.status(400).json({ message: "No receipt image provided" });
    }

    // get user id
    // const userId = req.user.id;

    // Calling Taggun API
    const receiptData = await scanReceipt(req.file);

    // Extracting data from Taggun response
    const transaction = new Transaction({
      type: "expense", // default to expense
      amount: receiptData.totalAmount?.data,
      category: req.body.category || "Uncategorized",
      tax: receiptData.taxAmount?.data,
      data: receiptData.date?.data,
      merchantName: receiptData.merchantName?.data,
      merchantAddress: receiptData.merchantAddress?.data,
    });

    await transaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (err) {
    console.error("Receipt transaction creation error:", err);
    res.status(500).json({
      message: "Failed to create transaction from receipt",
      error: err.message,
    });
  }
};

export default { processReceipt, createReceiptTransaction };
