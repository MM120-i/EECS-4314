import express from "express";
import authenticateToken from "../middleware/auth/jwt.js"; // unused rn
import userController from "../controllers/userController.js";
import errorHandler from "../middleware/errorHandler.js";

import betterDeals from "../services/betterDeals.js";
import transactionController from "../controllers/aggregationController.js";
import EMA_forecastNextMonth from "../services/forecastReceipt.js";
import { EMA_forecastCategorical } from "../services/forecastReceipt.js";

import fetchMonthlySpendings from "../utility/spendingAggregator.js";
import { fetchCategoricalSpendings } from "../utility/spendingAggregator.js";

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

// this block here should just be a function
// might fix it later idk
// also, this isnt protecected at all so like gotta fix this too

router.get("/user/transactions/:transactionId/deals", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const distance = parseInt(req.query.distance) || 5000; // defaults to 5km (5000 meters = 5km for the dumbasses who cudnt understand)
    const days = parseInt(req.query.days) || 30; // defaults to 30 days

    console.log("selected distance: " + distance);
    console.log("selected days range: " + days);

    const deals = await betterDeals(transactionId, distance, days);

    // return the deals

    return res.status(200).json({
      status: "Success",
      message:
        deals.length > 0
          ? `Successfully found ${deals.length} nearby`
          : "No deals found :(",
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

// protect this too plsssssss
router.get("/user/monthly/forecast", async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    console.log(userId);
    const monthlySpendings = await fetchMonthlySpendings(userId);
    const forecast = await EMA_forecastNextMonth(monthlySpendings);

    // return the forecast

    return res.status(200).json({
      status: "Success",
      message: {
        forecast: parseFloat(forecast.forecast.toFixed(2)),
        month: forecast.nextMonth,
        year: forecast.nextYear,
        monthName: forecast.nextMonthName,
      },
    });
  } catch (err) {
    console.error("Error finding deals:", err);
    return res.status(500).json({
      status: "Error",
      message: "Error with forecast",
    });
  }
});

router.get("/user/category/forecast", async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    const { summarizedData, data } = await fetchCategoricalSpendings(userId);
    const forecast = await EMA_forecastCategorical(summarizedData);

    // console.log("Summarized Data:", { summarizedData });

    // return the forecast

    return res.status(200).json({
      status: "Success",
      data: forecast,
    });
  } catch (err) {
    console.error("Error finding deals:", err);
    return res.status(500).json({
      status: "Error",
      message: "Error with forecast",
    });
  }
});

router.get(
  "/user/monthly",
  authenticateToken,
  transactionController.getMonthlySpendings
);

router.get(
  "/user/categorical",
  authenticateToken,
  transactionController.getCategoricalSpendings
);

router.use(errorHandler);

export default router;
