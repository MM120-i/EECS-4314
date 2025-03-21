import mongoose from "mongoose";

const PlaidSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plaidAccessToken: {
      type: String,
      required: true,
    },
    plaidItemId: {
      type: String,
      required: true,
    },
    plaidAccounts: [
      {
        accountId: { type: String, required: true },
        name: { type: String },
        type: { type: String },
        subtype: { type: String },
        mask: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Plaid = mongoose.model("Plaid", PlaidSchema);
export default Plaid;
