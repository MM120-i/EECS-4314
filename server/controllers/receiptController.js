// Models
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
// Functions
import scanReceipt from "../services/taggun.js";
import categorizeTransaction from "../services/openai.js";
import geocodeAddress from "../services/geocoding.js";

const processReceipt = async (req, res) => {
  try {
    // If the file was not uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "Error", message: "No receipt image provided" });
    }

    // Calling Taggun API
    const receiptData = await scanReceipt(req.file);

    // console.log("Taggun API response:", JSON.stringify(receiptData, null, 2));

    // return raw data from Taggun
    res.status(200).json({
      message: "Receipt processed successfully",
      data: receiptData,
    });
  } catch (err) {
    console.error("Receipt processing error:", err);
    res
      .status(500)
      .json({ message: "Error processing receipt", error: err.messsage });
  }
};

// Creating a new Transaction for structured response
const createReceiptTransaction = async (req, res) => {
  try {
    // If the file was uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "Error", message: "No receipt image provided" });
    }

    // get user id
    const userId = req.user?.id || req.query.userId;
    let userEmail;
    const user = await User.findOne({ _id: userId });
    console.log("The user id: " + userId);

    if (user) {
      userEmail = user.email;
      console.log("The user email: " + userEmail);
    } else {
      console.log("User not found");
    }

    // Calling Taggun API
    const receiptData = await scanReceipt(req.file);
    // console.log(JSON.stringify(receiptData, null, 2));

    // Extracting data from Taggun response
    const transactionData = {
      userId: userId,
      userEmail: userEmail,
      type: "expense", // default to expense
      amount: receiptData.totalAmount?.data,
      category: req.body.category || "Uncategorized",
      tax: receiptData.taxAmount?.data,
      date: receiptData.date?.data,
      merchantName: receiptData.merchantName?.data,
      merchantAddress: receiptData.merchantAddress?.data,
      // basically what this thing is doing is:
      // checks if amounts exists in the receiptData using optional chaining
      // finds the index of the item where a.text includes "subtotal"
      // then only the item whose index is less than the index of the "subtotal" is kept
      // basically makes it so that everything before subtotal is added to the items
      // items:
      //   receiptData.amounts
      //     ?.filter(
      //       (item) =>
      //         item.index <
      //         receiptData.amounts.findIndex((a) =>
      //           a.text?.toLowerCase().includes("subtotal")
      //         )
      //     )
      //     .map((item) => ({
      //       name: item.text,
      //       price: item.data,
      //       quantity: 1,
      //       totalPrice: item.data,
      //     })) || [],

      // ok so i just changed this stuff and now its MUCHHHHHHH easier to read
      // idky but entities did not exist in the receiptData at first
      // but now it does??? how does that even work
      // im keeping the code above incase it breaks again cus like everything breaks :(

      items: receiptData.entities?.productLineItems?.map((item) => ({
        name: cleanItemNames(item.data.name.data),
        price: item.data.totalPrice.data,
        quantity: item.data.quantity.data,
        totalPrice: item.data.totalPrice.data,
      })),
    };

    // ok so now we can actually use this ai thing to categorize the transaction ykwim or no?
    const categoryBasedOnAi = await categorizeTransaction(transactionData);

    // Alright and now we need to get the geolocation thing to work too
    if (transactionData.merchantAddress) {
      const coordinates = await geocodeAddress(transactionData.merchantAddress);
      // if we do end up getting the coordinates, we can just set them
      if (coordinates) {
        transactionData.location = {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude],
        };
      }
    }

    // ok now we can save the transaction and hope it works properly
    const transaction = new Transaction({
      userId: userId,
      userEmail: userEmail,
      type: "expense",
      amount: transactionData.amount,
      category: categoryBasedOnAi, // Use the AI-determined category
      tax: transactionData.tax,
      date: transactionData.date,
      merchantName: transactionData.merchantName,
      merchantAddress: transactionData.merchantAddress,
      items: transactionData.items,
      location: transactionData.location, // Set the location if available (lon/lat)
    });

    // and BOOM this shi works I think

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

const manualReceiptMaker = async (req, res) => {
  try {
    const receiptData = req.body;

    const userId = req.user?.id || req.query.userId;

    const transaction = new Transaction({
      userId: userId,
      type: "expense",
      amount: receiptData.amount,
      category: receiptData.category || "Uncategorized",
      tax: receiptData.tax,
      date: receiptData.date,
      merchantAddress: receiptData.merchantAddress,
      location: {
        type: "Point",
        coordinates: [
          receiptData.location.coordinates[0],
          receiptData.location.coordinates[1],
        ],
      },
      items: receiptData.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      })),
    });

    const savedTransaction = await transaction.save();
    console.log("Saved transaction:", savedTransaction.userId);

    // Also need to add the transaction to the user object
    await User.findByIdAndUpdate(userId, {
      $push: { transactions: savedTransaction._id },
    });

    return res.status(201).json({
      status: "Success",
      data: savedTransaction,
    });
  } catch (err) {
    console.error("Error creating manual transaction:", err);
    return res.status(500).json({
      status: "Error",
      message: "Failed to create transaction from receipt",
      error: err.message,
    });
  }
};

function cleanItemNames(item) {
  if (!item) return "";

  return item.split(/\s+\d{6,}|\s+[A-Z]\s+\d+\.\d+/)[0].trim();
}

export default { processReceipt, createReceiptTransaction, manualReceiptMaker };
