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
      "category _id"
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
      });
    } else {
      // just means its a normal transaction (not a receipt)
      return res.status(200).json({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
      });
    }
  } catch (err) {
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
};
