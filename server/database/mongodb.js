import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js"; // NODE_ENV doesnt exist yet
import dotenv from "dotenv";

dotenv.config();

if (!DB_URI) {
  throw new Error(
    "Pls define the MONGODB_URI environment variable inside .env"
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

export default connectToDatabase;
