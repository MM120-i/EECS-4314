import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // additional fields
  merchant: { type: String },
  merchantAddress: { type: String },
  tax: { type: Number },
});

export default mongoose.model("Transaction", TransactionSchema);
