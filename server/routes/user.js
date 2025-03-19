import express from "express";
import authenticateToken from "../middleware/auth/jwt.js"; // unused rn
import userController from "../controllers/userController.js";
import errorHandler from "../middleware/errorHandler.js";

import betterDeals from "../services/betterDeals.js";

const router = express.Router();

// User resource routes
router.get("/user", authenticateToken, userController.getUserById);

// Transaction resource routes
router.get(
  "/user/transactions",
  authenticateToken,
  userController.getUserTransactions
);

router.get(
  "/user/transactions/:transactionId",
  authenticateToken,
  userController.getTransactionById
);

router.get("/user/transactions/:transactionId/deals", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const distance = parseInt(req.query.distance) || 5000; // defaults to 5km
    const days = parseInt(req.query.days) || 2800; // defaults to 30 days

    const deals = await betterDeals(transactionId, distance, days);

    // return the deals

    return res.status(200).json({
      status: "Success",
      message: `Successfully found ${deals.length} nearby`,
      deals: deals,
    });
  } catch (err) {
    console.error("Error finding deals:", err);
    return res.status(500).json({
      status: "Error",
      message: "No deals found",
    });
  }
});

router.use(errorHandler);

export default router;
