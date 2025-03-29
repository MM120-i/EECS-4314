// Models
import Receipt from "../models/Receipt.js";
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
    const taggunReceiptData = await scanReceipt(req.file);
    // console.log(JSON.stringify(receiptData, null, 2));

    // Extracting data from Taggun response
    const receiptData = {
      userId: userId,
      userEmail: userEmail,
      type: "expense", // default to expense
      amount: taggunReceiptData.totalAmount?.data,
      category: req.body.category || "Uncategorized",
      tax: taggunReceiptData.taxAmount?.data,
      date: taggunReceiptData.date?.data,
      merchantName: taggunReceiptData.merchantName?.data,
      merchantAddress: taggunReceiptData.merchantAddress?.data,
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

      items: taggunReceiptData.entities?.productLineItems?.map((item) => ({
        name: cleanItemNames(item.data.name.data),
        price: item.data.totalPrice.data,
        quantity: item.data.quantity.data,
        totalPrice: item.data.totalPrice.data,
      })),
    };

    // ok so now we can actually use this ai thing to categorize the transaction ykwim or no?
    const categoryBasedOnAi = await categorizeTransaction(receiptData);

    // Alright and now we need to get the geolocation thing to work too
    if (receiptData.merchantAddress) {
      const coordinates = await geocodeAddress(receiptData.merchantAddress);
      // if we do end up getting the coordinates, we can just set them
      if (coordinates) {
        receiptData.location = {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude],
        };
      }
    }

    // ok now we can create the receipt and hope it works properly
    const receipt = new Receipt({
      userId: userId,
      userEmail: userEmail,
      type: "expense",
      amount: receiptData.amount,
      category: categoryBasedOnAi, // Use the AI-determined category
      tax: receiptData.tax,
      date: receiptData.date,
      merchantName: receiptData.merchantName,
      merchantAddress: receiptData.merchantAddress,
      items: receiptData.items,
      location: receiptData.location, // Set the location if available (lon/lat)
    });

    const savedReceipt = await receipt.save();

    // and BOOM this shi works I think

    // after making changes to the models/schemas
    // we gotta make a new transaction and add the receipt to that
    // then we can just add the transaction id to the user

    const transaction = new Transaction({
      userId: userId,
      userEmail: userEmail,
      receiptId: savedReceipt._id, // reference to the receipt
      date: receiptData.date,
      description: `Purchase at ${
        receiptData.merchantName || "Unknown Merchant"
      }`,
      category: categoryBasedOnAi,
      amount: receiptData.amount,
    });

    const savedTransaction = await transaction.save();

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

    const transaction = new Receipt({
      userId: userId,
      type: receiptData.type || "expense",
      amount: receiptData.amount || "0",
      category: receiptData.category || "Uncategorized",
      tax: receiptData.tax || "0",
      date: receiptData.date || new Date(),
      merchantAddress: receiptData.merchantAddress || "No address",
      location: {
        type: "Point",
        coordinates: [
          receiptData.location.coordinates[0] || null,
          receiptData.location.coordinates[1] || null,
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
      message: "Receipt created successfully",
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

const deleteReceiptItem = async (req, res) => {
  /*
   Ok so basically what we want to do is delete an individual item from a receipt
   what im thinking is:
   we get the transaction id and the item id
   so we can run a check to see if the item exists in that transaction 
   then delete it


   ok after some research:
   theres like a 3 line code (mongo has this query and update method) thing that just does this
   but much faster
   */
  try {
    const { receiptId, itemId } = req.params || req.body;

    // lets make sure the receipt and the item exist

    const receipt = await Receipt.findById(receiptId);

    if (!receipt) {
      return res.status(404).json({
        status: "Error",
        message: "Receipt not found",
      });
    }

    const item = receipt.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        status: "Error",
        message: "Item not found in receipt",
      });
    }

    const itemName = Receipt.findById(receiptId).name;
    await Receipt.findByIdAndUpdate(
      receiptId,
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    return res.status(201).json({
      status: "Success",
      message: "Receipt item deleted successfully",
      data: itemName,
    });
  } catch (err) {
    console.error("Error deleting item from receipt", err);
    return res.status(500).json({
      status: "Error",
      message: "Failed to delete item from receipt",
      error: err.message,
    });
  }
};

const deleteReceipt = async (req, res) => {
  /*
    just get the receipt id from the frontend
    then delete the receipt with that id
    simple
    */
  try {
    const { recieptId } = req.body;

    const userId = req.user?.id || req.query.userId;

    const receipt = await Receipt.findByIdAndDelete(recieptId);
    console.log("Deleted transaction:", recieptId.userId);

    // Also need to remove the transaction from the user object
    await User.findByIdAndUpdate(userId, {
      $pull: { transactions: receipt._id },
    });

    res.status(201).json({
      status: "Success",
      message: "Receipt deleted successfully",
      data: transaction,
    });
  } catch (err) {
    console.error("Error deleting receipt :", err);
    res.status(500).json({
      status: "Error",
      message: "Failed to delete receipt",
      error: err.message,
    });
  }
};

function cleanItemNames(item) {
  if (!item) return "";

  return item.split(/\s+\d{6,}|\s+[A-Z]\s+\d+\.\d+/)[0].trim();
}

export default {
  processReceipt,
  createReceiptTransaction,
  manualReceiptMaker,
  deleteReceiptItem,
  deleteReceipt,
};
