import mongoose from "mongoose";

import Transaction from "../models/Transaction.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gouledm:GpXYtKoS6kjJgxKQ@cluster0.8hvgv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

// Generate random coordinates within a specific region by limiting coords
const generateRandomCoordinates = () => {
  const lat = 43.6 + Math.random() * 0.2; // 43.6 to 43.8
  const lng = -79.5 + Math.random() * 0.2; // -79.5 to -79.3
  return [lng, lat]; // GeoJSON format is [longitude, latitude]
};

// Generate random transactions
const generateTransactions = (count) => {
  const transactions = [];
  for (let i = 0; i < count; i++) {
    transactions.push({
      userId: new mongoose.Types.ObjectId(),
      userEmail: `user${i}@example.com`,
      type: Math.random() > 0.5 ? "income" : "expense",
      amount: Math.floor(Math.random() * 500) + 10, // $10 - $500
      category: ["Food", "Electronics", "Transport", "Clothing"][
        Math.floor(Math.random() * 4)
      ],
      date: new Date(),
      merchant: `Store ${i}`,
      merchantAddress: `Address ${i}`,
      location: {
        type: "Point",
        coordinates: generateRandomCoordinates(),
      },
      tax: Math.random() * 15,
      items: [
        {
          name: "Item " + i,
          price: Math.random() * 100,
          quantity: Math.floor(Math.random() * 3) + 1,
          totalPrice: Math.random() * 100,
        },
      ],
    });
  }
  return transactions;
};

const deleteRecentTransactions = async () => {
  try {
    // Calculate the timestamp for one hour ago
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    console.log(
      `Deleting transactions created after: ${oneHourAgo.toISOString()}`
    );

    // First, find the transactions that will be deleted to show a preview
    const transactionsToDelete = await Transaction.find({
      date: { $gte: oneHourAgo },
    });

    console.log(`Found ${transactionsToDelete.length} transactions to delete:`);

    // Show a preview of what will be deleted
    transactionsToDelete.forEach((doc, index) => {
      console.log(
        `${index + 1}. ID: ${doc._id}, Date: ${doc.date}, Merchant: ${
          doc.merchant || "N/A"
        }`
      );
    });

    // Confirm and delete
    console.log("\nProceeding with deletion...");

    const result = await Transaction.deleteMany({
      date: { $gte: oneHourAgo },
    });

    console.log(`✅ Successfully deleted ${result.deletedCount} transactions`);
  } catch (error) {
    console.error("Error deleting recent transactions:", error);
  }
};

// Insert data into MongoDB
const seedDatabase = async () => {
  await connectDB();

  // for adding transactions
  // const hm = 10000; // Number of transactions to generate
  // const transactions = generateTransactions(hm); // Insert 200 transactions
  // await Transaction.insertMany(transactions);
  // console.log(`Inserted ${hm} dummy transactions!`);

  // for deleting recent transactions (1h time range)
  await deleteRecentTransactions();
  mongoose.connection.close();
};

// Run the seeding function
seedDatabase();
