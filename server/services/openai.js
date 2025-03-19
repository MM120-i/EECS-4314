import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// creates a new openai instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Categories that ==Christie + Mahim== agreed on so its not on me if they arent good enough
const CATEGORIES = [
  "Groceries",
  "Health and Fitness",
  "Office expenses",
  "Shopping",
  "Entertainment",
  "Transportation",
  "Dining",
  "Personal Care",
  "Other Transfers",
  "Other",
];

// Using OpenAI to categorize an entire Transaction (receipt)

const categorizeTransaction = async (transactionData) => {
  try {
    // Get the data from the transaction to send to openai
    const { merchantName, items, amount } = transactionData;

    // prompt for gpt
    const messages = [
      {
        role: "system",
        content: `You are the best financial assistant that categorizes transactions. 
                Based on the transaction details, assign ONE category from this list: 
                ${CATEGORIES.join(", ")}. 
                Return ONLY the category name, nothing else.`,
      },
      {
        role: "user",
        content: `Categorize this transaction: 
                Merchant: ${merchantName},
                 Items: ${
                   items && items.length > 0
                     ? items
                         .map((item) => `${item.name}: $${item.price}`)
                         .join(", ")
                     : "Not specified"
                 },
                Amount: ${amount}`,
      },
    ];

    // these parameters are based on whatever openai wants dont change this plssssss

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // model name
      messages,
      temperature: 0.3, // temp is just the consistency (lower is better)
      max_tokens: 20,
    });

    // to actally get the category

    // alright so listen. This is how the response is structured listen up and watch:
    // {id, object, created, model, choiced [{index, message: {role, content}}]}
    // theres more but like we only care about content
    const predictedCategory = completion.choices[0].message.content.trim();

    // Check if the category is valid (in the list of categories)
    const validCategory = CATEGORIES.find(
      (category) => category.toLowerCase() === predictedCategory.toLowerCase()
    );

    return validCategory || "Other";
  } catch (err) {
    console.error("Error categorizing this trasaction", err);
    return "Uncategorized";
  }
};

// const completion = openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   store: true,
//   messages: [{ role: "user", content: "write a haiku about ai" }],
// });

// // completion.then((result) => console.log(result.choices[0].message));

export default categorizeTransaction;
