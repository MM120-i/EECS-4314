import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// routes
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import receiptRoutes from "./routes/receipt.js";
import userRoutes from "./routes/user.js";
import plaidRoutes from "./routes/plaid.js";
//middleware
import authenticateToken from "./middleware/auth/jwt.js";
// Error handler
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/receipt", authenticateToken, receiptRoutes);
app.use("/api", authenticateToken, userRoutes);
app.use("/api/plaid", plaidRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running brooo");
});

if (!process.env.DB_URI) {
  console.error("DB_URI is missing in .env file.");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB Connected (lfggg)");
  } catch (err) {
    console.error("MongoDB Connection Error: 🥺 ", err);
    process.exit(1);
  }
};

connectDB();

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
