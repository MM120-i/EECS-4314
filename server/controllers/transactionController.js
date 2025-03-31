import Receipt from "../models/Receipt.js";
import Transaction from "../models/Transaction.js";
import plaidClient from "../services/plaid.js";

import User from "../models/User.js";

const createTransaction = async (req, res) => {
  /* 
    ok so, we are gonna get some data from the frontend:
        date
        desc
        category (optional)
        amount

    based on this we just make a new transaction and that it
    thats it thats all 
    */

  try {
    const { date, description, category, amount, name } = req.body;

    const userId = req.user?.id || req.query.userId;

    // lets also get the user email
    let userEmail;
    const user = await User.findOne({ _id: userId });
    console.log("The user id: " + userId);

    if (user) {
      userEmail = user.email;
      console.log("The user email: " + userEmail);
    } else {
      console.log("User not found");
    }

    const transaction = new Transaction({
      userId: userId,
      date: date || Date.now(),
      description: description || "No description",
      category: category || "Uncategorized",
      amount: Math.abs(amount).toFixed(2) || "0.00",
      name: name || "Unnamed",
      type: "standalone",
    });

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

const deleteTransaction = async (req, res) => {
  /*
    just get the transaction id from the frontend
    then delete the transaction with that id
    thats it
    thats all
    super simple no?
    */

  /*
    ok so an issue i ran into:
    getting the transactionId from req.body || req.params.transactionId
    didnt realize that an empty object {} from req.body still holds true
    so it was basically sending an empty object as a parameter to search for a transaction
    my fault my bad
    
    */

  try {
    const transactionId = req.params.transactionId;

    const userId = req.user?.id || req.query.userId;

    const transaction = await Transaction.findById(transactionId);

    console.log(transaction);

    if (!transaction) {
      return res.status(404).json({
        status: "Error",
        message: "Transaction not found",
      });
    }

    console.log("found transaction: " + transaction);

    await Transaction.findByIdAndDelete(transactionId);
    // Also need to remove the transaction from the user object
    await User.findByIdAndUpdate(userId, {
      $pull: { transactions: transactionId },
    });

    res.status(201).json({
      status: "Success",
      message: "Transaction deleted successfully",
      data: transaction,
    });
  } catch (err) {
    console.error("Error deleting transaction :", err);
    res.status(500).json({
      status: "Error",
      message: "Failed to delete transaction",
      error: err.message,
    });
  }
};

export const importPlaidTransactions = async (req, res) => {
  try {
    const { userId, accessToken, accountId } = req.body;

    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: "2024-01-01",
      end_date: "2025-04-01",
      options: {
        count: 10,
        account_ids: [accountId],
      },
    });

    const transactions = response.data.transactions.slice(0, 10);
    const saved = [];

    for (const tx of transactions) {
      const transaction = new Transaction({
        userId,
        date: tx.date,
        description: tx.name || "No description",
        category: tx.category?.[0] || "Uncategorized",
        amount: Math.abs(tx.amount).toFixed(2),
        name: tx.merchant_name || tx.name || "Unnamed",
        type: "standalone",
      });

      const savedTx = await transaction.save();

      await User.findByIdAndUpdate(userId, {
        $push: { transactions: savedTx._id },
      });

      saved.push(savedTx);
    }
    res.status(201).json({
      status: "Success",
      message: "Imported Plaid transactions",
      data: saved,
    });
  } catch (err) {
    console.error("Error importing Plaid transactions:", err);
    res.status(500).json({
      status: "Error",
      message: "Failed to import Plaid transactions",
      error: err.message,
    });
  }
};

export default {
  createTransaction,
  deleteTransaction,
};
