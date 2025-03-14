import express from "express";
import authenticateToken from "../middleware/auth/jwt.js"; // unused rn
import userController from "../controllers/userController.js";
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router();

router.get("/getUser", authenticateToken, userController.getUser);
router.get(
  "/getUserTransactions",
  authenticateToken,
  userController.getUserTransactions
);

export default router;
