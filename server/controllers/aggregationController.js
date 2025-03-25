import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

import {
  fetchMonthlySpendings,
  fetchCategoricalSpendings,
} from "../utility/spendingAggregator.js";

// not even sure if we are gonna use it but its a cool feature
// predicts the users spending habits based off their receipts
// Might even add a way to predict their spending habits based on the categories
// meaning they will get insights like: "You are on pace to spend this much on groceries"
// cud be cool

// Need to aggregate transactions (receipts) based on their time period
// so like weekly - monthly - yearly

/*
These will get the daily - monthly spendings of the user from their receipts
Good thing is, mongo already has a way to group the transactions :)
Makes everything sm easier holyyyy
*/

const getDailySpendings = async (req, res) => {
  try {
    // getting the user id fromm their jwt
    const userId = req.user?.id || req.query.userId;

    const monthlySpendings = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // group the transactions by year and month to get monthly spendings
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          totalSpent: { $sum: "$amount" },
          count: { $sum: 1 }, // this just gets the number of receipts that month
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return res.status(200).json({ data: monthlySpendings });
  } catch (err) {
    console.error("Error getting monthly spendings", err);
    return res.status(500).json({
      status: "Error",
      message: "Error getting monthly spendings",
      error: err.message,
    });
  }
};

const getMonthlySpendings = async (req, res) => {
  try {
    // getting the user id fromm their jwt
    const userId = req.user?.id || req.query.userId;

    const monthlySpendings = await fetchMonthlySpendings(userId);

    return res.status(200).json({ data: monthlySpendings });
  } catch (err) {
    console.error("Error getting monthly spendings", err);
    return res.status(500).json({
      status: "Error",
      message: "Error getting monthly spendings",
      error: err.message,
    });
  }
};

const getCategoricalSpendings = async (req, res) => {
  try {
    // getting the user id fromm their jwt
    const userId = req.user?.id || req.query.userId;
    const categoricalSpendings = await fetchCategoricalSpendings(userId);

    // we now need to aggregate this data from categoricalSpendings to get a summary
    // of the spendings

    // Ok so, im thinking ab making it so that this function sends two things
    // first the summary of the data
    // second the raw data (without aggregation)

    // to do this
    // lets create an object that holds objects based on categories
    // loop over each item within categoricalSpendings object
    // check if the category exists
    // push the other data into the category

    // ok so this is where we will store this shi
    // its an object that holds objects (categories) that holds an array of objects
    // amazing
    let summarizedData = {};

    categoricalSpendings.forEach((data) => {
      // lets check if summariezedData has the category
      const { category, year, month } = data._id;
      const totalSpent = data.totalSpent;

      // if summariezedData does not have the category
      // ok so whats happening here is that
      // first we check if the category exists
      // if it doesnt we create that category and let that store an array
      // what this does is that it allows us to use the push function
      // which is only for arrays
      // then we can push the array into the category as an object
      if (!summarizedData[category]) {
        summarizedData[category] = [];
      }

      summarizedData[category].push({
        year: year,
        month: month,
        totalSpent: totalSpent,
      });
    });

    return res
      .status(200)
      .json({ summarizedData: summarizedData, data: categoricalSpendings });
  } catch (err) {
    console.error("Error getting categorical spendings", err);
    return res.status(500).json({
      status: "Error",
      message: "Error getting categorical spendings",
      error: err.message,
    });
  }
};

const getMerchantSpendings = async (req, res) => {
  try {
    // getting the user id fromm their jwt
    const userId = req.user?.id || req.query.userId;

    const merchantSpendings = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // group transactions by merchant name
      // this actually doesnt work cus we dont store the merchant name in the schema
      // we prolly shud do that ngl
      {
        $group: {
          _id: "$merchant",
          totalSpent: { $sum: "$amount" },
          count: { $sum: 1 }, // this just gets the number of receipts that month
        },
      },
      //  sort this by the highest spent on a merchant
      { $sort: { totalSpent: -1 } },
    ]);

    return res.status(200).json({ data: merchantSpendings });
  } catch (err) {
    console.error("Error getting monthly spendings", err);
    return res.status(500).json({
      status: "Error",
      message: "Error getting monthly spendings",
      error: err.message,
    });
  }
};

export default {
  getMonthlySpendings,
  getCategoricalSpendings,
  getMerchantSpendings,
};
