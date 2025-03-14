import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

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

    const user = await User.findById(userId)
      .select("name email transactions")
      .populate({ path: "transactions", select: "userId category items" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { getUser, getUserTransactions };
