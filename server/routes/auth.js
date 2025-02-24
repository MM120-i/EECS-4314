import express from "express";
import authenticateToken from "../middleware/jwt.js";
import { login, register } from "../controllers/authController/js";

const router = express.Router();

// login route
router.post("/login", login);

// register route
router.post("/register", register);

export default router;
