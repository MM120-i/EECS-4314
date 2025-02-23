import { config } from "dotenv";
import dotenv from "dotenv";

dotenv.config();

config({ path: `.env` });

export const { PORT, SERVER_URL, DB_URI } = process.env;
