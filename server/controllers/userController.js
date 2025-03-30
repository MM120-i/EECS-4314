import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

import Receipt from "../models/Receipt.js";

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;

    // Check if req includes transaction
    const includeTransaction = req.query.include === "transaction";

    // base query
    let query = User.findById(userId).select("name email");

    // conditionally include transaction

    if (includeTransaction) {
      query = query.select("transactions").populate({
        path: "transactions",
        select: "_id category",
      });
    }

    const user = await query;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    // get the user id from the request
    const userId = req.user?.id || req.query.userId;

    console.log(userId);

    // find user to populate transactions

    const user = await User.findById(userId)
      .select("name email transactions")
      .populate({ path: "transactions", select: "category" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    // get the user id from the request
    const userId = req.user?.id || req.query.userId;

    console.log(userId);

    // find user and populate transaction (might be good for security but idk)

    // const user = await User.findById(userId)
    //   .select("transactions")
    //   .populate({ path: "transactions", select: "category" });

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // res.status(200).json({ transactions: user.transactions });

    // or we can just use the transaction schema to get the transactions
    const transactions = await Transaction.find({ userId: userId }).select(
      "_id date receiptId description category amount name type"
    );

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    // user id from the jwt token
    const userId = req.user?.id;

    const transactionId = req.params.transactionId;

    const user = await User.findById(userId);

    const transaction = await Transaction.findById(transactionId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // check if the transaction belongs to the user
    if (!user.transactions.includes(transactionId)) {
      return res.status(404).json({
        message: "Transaction does not belong to this user",
      });
    }

    // check if the receipt has a receiptId (means its a receipt)
    if (transaction.receiptId) {
      const receipt = await Receipt.findById(transaction.receiptId);

      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }

      return res.status(200).json({
        transactionId: transaction._id,
        receiptId: receipt.receiptId,
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        merchant: receipt.merchant,
        items: receipt.items, // Only include the items array from the receipt
        name: transaction.name || "Unnamed",
      });
    } else {
      // just means its a normal transaction (not a receipt)
      return res.status(200).json({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        name: transaction.name || "Unnamed",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Server error",
    });
  }
};

const getUserReceipts = async (req, res) => {
  try {
    // get the user id from the request
    const userId = req.user?.id || req.query.userId;

    // Find all transactions for this user with type "expense" that have receiptId (or type "Receipt" if you have that)
    const receiptsTransactions = await Receipt.find({
      userId: userId,
    }).select("_id date description category amount name type");

    if (!receiptsTransactions || receiptsTransactions.length === 0) {
      return res.status(200).json({ receipts: [] });
    }

    res.status(200).json({ receipts: receiptsTransactions });
  } catch (err) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ message: err.message });
  }
};

const getReceiptById = async (req, res) => {
  try {
    // user id from the jwt token
    const userId = req.user?.id;
    const receiptId = req.params.receiptId; // This is now the actual receipt ID

    // First, verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the receipt directly by its ID
    const receipt = await Receipt.findById(receiptId);
    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    // Verify this receipt belongs to the user by checking the userId in the receipt
    if (receipt.userId && receipt.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Receipt does not belong to this user",
      });
    }

    // Find the associated transaction (if you still need transaction data)
    const transaction = await Transaction.findOne({ receiptId: receiptId });

    // Return receipt data (with transaction data if available)
    return res.status(200).json({
      receiptId: receipt._id,
      date: receipt.date || (transaction && transaction.date),
      merchant: receipt.merchant || "Unknown",
      merchantAddress: receipt.merchantAddress,
      items: receipt.items,
      tax: receipt.tax,
      amount: receipt.amount || (transaction && transaction.amount),
      // Include these if transaction exists
      ...(transaction && {
        transactionId: transaction._id,
        description: transaction.description,
        category: transaction.category,
        name: transaction.name || "Unnamed",
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Server error",
    });
  }
};

export default {
  getUserById,
  getUser,
  getUserTransactions,
  getTransactionById,
  getUserReceipts,
  getReceiptById,
};
