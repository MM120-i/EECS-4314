import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

//require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// app.use(""); // gotta add authRoutes
// app.use(); // add transactionRoutes

app.get("/", (req, res) => {
  res.send("Backend is running brooo");
});

// gotta have a env MONGO_URI variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
