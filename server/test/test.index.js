import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gouledm:GpXYtKoS6kjJgxKQ@cluster0.8hvgv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

const listIndexes = async () => {
  try {
    const indexes = await Transaction.collection.indexes();
    console.log("Indexes for Transaction collection:");
    console.log(JSON.stringify(indexes, null, 2));
    return indexes;
  } catch (error) {
    console.error("Error listing indexes:", error);
  }
};

// Run the script
(async () => {
  await connectDB();
  await listIndexes();
  //   console.log("dropping index");
  //   await Transaction.collection.dropIndex("location_2dsphere");
  await mongoose.connection.close();
  console.log("Connection closed");
})();
