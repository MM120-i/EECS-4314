import mongoose from "mongoose";

import Transaction from "../models/Transaction.js";

// connecting to mongodb

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

const testGeospatialQuery = async () => {
  try {
    console.log("This is to check how much impact indexing has");

    const result = await Transaction.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [-79.3832, 43.6532] },
          $maxDistance: 5000, // 5km
        },
      },
    }).explain("executionStats");

    // Output execution stats
    console.log(
      "Execution Time (ms):",
      result.executionStats.executionTimeMillis
    );
    console.log("Documents Examined:", result.executionStats.totalDocsExamined);
    console.log("Documents Returned:", result.executionStats.nReturned);
    console.log("Index Used:", result.executionStats.indexFilterSet);

    // Check the winning plan for geo stages
    const winningPlan = result.queryPlanner.winningPlan;
    console.log("\nWinning Plan Stage:", winningPlan.stage);

    // In MongoDB Atlas, the stage might be GEO_NEAR_2DSPHERE instead of GeoNear
    const isUsingGeoIndex =
      winningPlan.stage === "GEO_NEAR_2DSPHERE" ||
      winningPlan.stage === "GeoNear" ||
      JSON.stringify(winningPlan).includes("GeoNear");

    if (isUsingGeoIndex) {
      console.log("✅ USING GEOSPATIAL INDEX: Yes");

      // Extract and display the index name
      if (winningPlan.indexName) {
        console.log("Index Name:", winningPlan.indexName);
      } else if (winningPlan.inputStage && winningPlan.inputStage.indexName) {
        console.log("Index Name:", winningPlan.inputStage.indexName);
      }
    } else {
      console.log("❌ USING GEOSPATIAL INDEX: No");
      console.log(
        "Winning Plan Details:",
        JSON.stringify(winningPlan, null, 2)
      );
    }

    // If there's no data returned, explain why
    if (result.executionStats.nReturned === 0) {
      console.log("\nNOTE: No documents were returned. This could be because:");
      console.log(
        "1. There are no documents with location data in the collection"
      );
      console.log(
        "2. No documents match the geospatial criteria (within 5km of Toronto)"
      );
      console.log(
        "3. The location data might not be in the correct GeoJSON format"
      );

      // Check if there are any documents with location data
      const docsWithLocation = await Transaction.countDocuments({
        "location.type": "Point",
        "location.coordinates": { $exists: true, $type: "array" },
      });

      console.log(`\nDocuments with valid location data: ${docsWithLocation}`);

      if (docsWithLocation === 0) {
        console.log(
          "You should add some test data with valid location information."
        );
      }
    }
  } catch (error) {
    console.error("Error running geospatial query:", error);
  } finally {
    mongoose.connection.close();
  }
};

// running the test
(async () => {
  await connectDB();
  await testGeospatialQuery();
})();
