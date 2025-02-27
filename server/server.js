import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running brooo");
});

if (!process.env.DB_URI) {
  console.error("DB_URI is missing in .env file.");
  process.exit(1);
}

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB Connected (lfggg)"))
  .catch((err) => {
    console.log("MongoDB connection Error: ", err);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
