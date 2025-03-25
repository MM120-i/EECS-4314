import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const fetchMonthlySpendings = async (userId) => {
  try {
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
          },
          totalSpent: { $sum: "$amount" },
          count: { $sum: 1 }, // this just gets the number of receipts for that month
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return monthlySpendings;
  } catch (err) {
    console.error("Error getting monthly spendings", err);
    throw err;
  }
};

// ok lets add one for categories cus that will look much MUCH cooler
//

export const fetchCategoricalSpendings = async (userId) => {
  try {
    const categoricalSpendings = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalSpent: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },

      // we can sort this by category, year, and month
      { $sort: { "_id.category": -1, "_id.year": -1, "_id.month": -1 } },
    ]);

    let summarizedData = {};

    categoricalSpendings.forEach((data) => {
      // lets check if the summarizedData set has the category
      const { category, year, month } = data._id;
      const totalSpent = data.totalSpent;

      // if summariezedData does not have the category:
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

    return { summarizedData, categoricalSpendings };
  } catch (err) {
    console.error("Error getting monthly spendings", err);
    throw err;
  }
};

export default fetchMonthlySpendings; //
