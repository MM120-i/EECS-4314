import Transaction from "../models/Transaction.js";

import stringSimilarity from "string-similarity";

// alright so we need a way to find better deals based on the receipts in our db

// This is the plan:
// the function will take 3 params:
// transactionId (the transaction we gotta find deals for)
// distance (how far the cheaper item can be --> we dont wanna send the user to a different province for milk thats like 2 bucks cheaper )
// days (item prices change bare times (i think) --> have to make it so that we only check items or receipts that are like 30 days old (this wud acc reduce our lookup times as well which is like amazzingggggggg :))
async function betterDeals(transactionId, distance, days) {
  try {
    // get the og transaction ywadwadwada
    const originalTransaction = await Transaction.findById(transactionId);
    console.log(originalTransaction._id);

    // Now lets check if the og transaction even has items in the first place
    if (originalTransaction.items.length === 0) {
      return {
        status: "Error",
        message: "No items found in the original transaction",
      };
    }

    // now we need a date range for comparison
    // this basically gets a date then just subtracts (??? how tf does this work) the specified date from the new date???
    const dateRange = new Date();
    dateRange.setDate(dateRange.getDate() - days);

    // Now for some black magic
    // gotta get the transactions that are close to the original transaction addy
    const nearbyTransactions = await Transaction.find({
      // first of all do NOT include the og transaction id
      _id: { $ne: transactionId }, // $ne is just 'not equal to'
      date: { $gte: dateRange }, // $gte is just 'greater than or equal to'
      // this is where the geospatial thing is used (coords)
      location: {
        $near: {
          // Mongo thing that basically checks for things near this location
          $geometry: originalTransaction.location, // reference point (og transaction location)
          $maxDistance: distance, // max distance from the reference point in meters
        },
      },
    });

    console.log(nearbyTransactions);

    // Now that we have the transactions that are close to the original transaction
    // we gotta check to first see if any items match
    // to check we cant just check if item1 === item2 --> that doesnt even do anything
    // we will use fuzzy string matching
    // basically what it does is checks to see how similar two strings are
    // gives it a score or i guess ratio i think?? and we can check if we want to include items based on how high the ratio is

    // alr enough lets acc store the deals somewhere
    const deals = [];

    // ok amazing so lets now loop through all the items we have in the transactions that are close by
    // to do that:
    // Loop through all the items of the og transaction
    // loop through each transaction of nearby transactions
    // check each item of the items in nearby transactions
    for (const originalItem of originalTransaction.items) {
      // check if the item has a price
      if (!originalItem.price) {
        continue; // skip this item cus it does not have a price
      }
      const originalMerchantAddress = originalTransaction.merchantAddress;

      const potentialDeals = [];

      for (const transaction of nearbyTransactions) {
        // lets get the merchant name so we can acc tell the user that "YO this item mad cheap at this store". cus we cant just say like "yo we found this item for cheaper but im not gonna tell u where its at"
        const merchantName = transaction.merchantAddress;

        // now lets loop thru all the items in the transaction and compare to the og transaction item
        for (const itemToCompare of transaction.items || []) {
          // compare the item price
          const itemPrice = itemToCompare.price || itemToCompare.totalPrice; // We shud prolly change this totalPrice field cus it seems redundant asl
          const originalItemPrice =
            originalItem.price || originalItem.totalPrice;

          // if items dont have a price
          if (!itemPrice || !originalItemPrice) {
            continue; // skip this item cus no price
          }

          // ok time to check if the item is similar or not
          // We can do a couple things
          // first: just use the basic === check and hope all the items are labelled the same way on the receipts
          // second: or actually be smart about it and use fuzzy string comparision that checks how similar two strings are
          // second option is prolly better --> items may not have the same name on different receipts

          if (
            fuzzyStringSimilarity(originalItem, itemToCompare) &&
            itemPrice < originalItemPrice
          ) {
            const savings = originalItemPrice - itemPrice;
            const savingPercentage = (savings / originalItemPrice) * 100;

            potentialDeals.push({
              originalItem: {
                name: originalItem.name,
                price: originalItem.price,
                merchant: originalMerchantAddress,
              },
              betterDeal: {
                name: itemToCompare.name,
                price: itemToCompare.price,
                merchant: merchantName,
                savings: savings,
                savingPercentage: savingPercentage,
              },
            });
          }
        }
      }
      if (potentialDeals.length > 0) {
        console.log(potentialDeals);
        potentialDeals.sort(
          (a, b) => b.betterDeal.savings - a.betterDeal.savings
        ); // a and b just takes the pairs of matches in the array and compares their savings
        deals.push(potentialDeals[0]);
      }
    }
    return deals;
    //
  } catch (err) {
    console.error("Error finding better deals ", err);
    throw err;
  }
}

function fuzzyStringSimilarity(item1, item2) {
  const similarity = stringSimilarity.compareTwoStrings(item1.name, item2.name);
  return similarity > 0.9; // from [0 to 1]. 1 is the highest similarity
}

export default betterDeals;
