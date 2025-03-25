import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
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
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // Merchant details
  merchant: { type: String },
  merchantAddress: { type: String },

  // Geospatial location for the merchant (this is for fast address lookup ok?)
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  tax: { type: Number },
  items: [
    {
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      totalPrice: Number,
      // More details for comparison
      sku: { type: String }, // stock keeping unit. So this is basically a way for the retailer to uniqely identify their product. Should just be the number above the barcode (not really sure if Taggun even extracts that but idk man lets see)
      barcode: { type: String },
      description: { type: String },
    },
  ],
});

// Geospatial index for the location field
TransactionSchema.index({ location: "2dsphere" });

export default mongoose.model("Transaction", TransactionSchema);
