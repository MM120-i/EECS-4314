import express from "express";
import Receipt from "../models/Receipt.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import authenticateToken from "../middleware/auth/jwt.js";
import transactionController from "../controllers/transactionController.js";

dotenv.config();

const router = express.Router();

/*
changing this entire file
authMiddleware is not needed (same logic is in middleware/auth/jwt.js)

gonna change the last two post routes to:
1. allow the user to add a transaction
2. allow the user to delete a transaction
*/

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
router.post(
  "/create",
  authenticateToken,
  transactionController.createTransaction
);

// Get all transactions for logged in users
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Receipt.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete(
  "/:transactionId",
  authenticateToken,
  transactionController.deleteTransaction
);

export default router;
