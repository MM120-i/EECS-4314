import express from "express";
const authenticateToken = require("../middleware/jwt.js");
const { login, register } = require("../controllers/authController/js");

const router = express.Router();

// login route
router.post("/login", login);

// register route
router.post("/register", register);

export default router;
