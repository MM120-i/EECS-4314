import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.TAGGUN_API_KEY;
const baseUrl = "https://api.taggun.io/api/receipt/v1/verbose/file";

if (!apiKey) {
  console.warn("No Taggun API key");
}

// Return extracted data from a scanned receipt
//     file (recipt image using multer)

const scanReceipt = async (file) => {
  try {
    if (!apiKey) {
      throw new Error("Taggun API key is not configured");
    }
    const formData = new FormData();

    // Adding receipt to form data
    if (file.path) {
      formData.append("file", fs.createReadStream(file.path));
    } else if (file.buffer) {
      formData.append("file", file.buffer, file.originalname);
    } else {
      throw new Error("Invalid file format");
    }

    // Parameters from Taggun's documentation
    formData.append("extractLineItems", "true");
    formData.append("refresh", "false");
    formData.append("incognito", "false");

    // API request using axios
    const res = await axios.post(baseUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        apikey: apiKey,
        accept: "application/json",
      },
    });

    // return the raw response
    return res.data;
  } catch (err) {
    console.error("Error scanning receipt: " + err.message);
    throw err;
  }
};

export default scanReceipt;
