import express from "express";
import Transaction from "../models/Transaction.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

// For now we have a auth middleware to verify the token
// We should probably move this authMiddleware to the Middleware folder later
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, auth denied lmao" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not defined" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Add transaction
router.post("/", authMiddleware, async (req, res) => {
  const { type, amount, category } = req.body;

  try {
    const transaction = new Transaction({
      userId: req.user.id,
      type,
      amount,
      category,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all transactions for logged in users
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
