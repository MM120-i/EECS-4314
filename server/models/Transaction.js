import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userEmail: {
      type: String,
      ref: "User",
      required: false,
    },
    receiptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receipt",
      required: false,
    },
    date: {
      type: Date,
      required: false,
      default: Date.now,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
