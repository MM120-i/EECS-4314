import express from "express";
import plaidClient from "../services/plaid.js";
import dotenv from "dotenv";
import Plaid from "../models/Plaid.js";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

router.post("/create_link_token", async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: "user-id", 
      },
      client_name: "YUNeedMoney",
      products: ["transactions"],
      country_codes: ["US", "CA"],
      language: "en",
      // add webook for auto updates
    });
    res.json(response.data);
  } catch (error) {
    console.error("Plaid Error:", error);
    res.status(500).json({ error: "Failed to create link token" });
  }
});

// Exchanges public token for access token
router.post("/exchange_public_token", async (req, res) => {
  try {
    const { public_token, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    const accountsResponse = await plaidClient.accountsGet({ access_token: accessToken });
    const plaidData = await Plaid.findOneAndUpdate(
      { userId },
      {
        plaidAccessToken: accessToken,
        plaidItemId: itemId,
        plaidAccounts: accountsResponse.data.accounts.map(account => ({
          accountId: account.account_id,
          name: account.name,
          type: account.type,
          subtype: account.subtype,
          mask: account.mask,
        })),
      },
      { upsert: true, new: true }
    );

    res.json({ accessToken, itemId, accounts: plaidData.plaidAccounts });
  } catch (error) {
    console.error("Plaid Exchange Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to exchange public token", details: error.message });
  }
});

// Fetches transactions from Plaid
router.get("/transactions", async (req, res) => {
  try {
    const { userId } = req.query;

    const plaidData = await Plaid.findOne({ userId });

    if (!plaidData || !plaidData.plaidAccessToken) {
      return res.status(400).json({ error: "Access token not found for user" });
    }

    const response = await plaidClient.transactionsGet({
      access_token: plaidData.plaidAccessToken,
      start_date: "2024-01-01",
      end_date: "2024-12-31",
    });

    res.json(response.data);
  } catch (error) {
    console.error("Plaid Transactions Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch transactions", details: error.message });
  }
});

// Gets user's Plaid data
router.get("/accounts", async (req, res) => {
    try {
      const { userId } = req.query;
  
      const plaidData = await Plaid.findOne({ userId });
  
      if (!plaidData) {
        return res.status(404).json({ error: "No Plaid data found for user" });
      }
  
      res.json({ accounts: plaidData.plaidAccounts });
    } catch (error) {
      console.error("Error fetching Plaid accounts:", error.message);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });
  

export default router;
