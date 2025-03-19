import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

export const DB_URI = process.env.DB_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
export const TAGGUN_API_KEY = process.env.TAGGUN_API_KEY || "";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
