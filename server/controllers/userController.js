import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

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

    // find user and populate transaction

    // const user = await User.findById(userId)
    //   .select("transactions")
    //   .populate({ path: "transactions", select: "category" });

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // res.status(200).json({ transactions: user.transactions });

    // Alternatively we can just use the transaction schema to get the transactions
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if the transaction belongs to the user
    if (!user.transactions.includes(transactionId)) {
      return res.status(404).json({
        message: "Access denied: Transaction does not belong to this user",
      });
    }

    const result = await User.findById(userId).populate({
      path: "transactions",
      match: { _id: transactionId },
      select: "category items",
    });

    const transaction = result.transactions[0];

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getUserById,
  getUser,
  getUserTransactions,
  getTransactionById,
};
