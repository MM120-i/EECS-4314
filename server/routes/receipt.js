import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import authenticateToken from "../middleware/auth/jwt.js";
import receiptController from "../controllers/receiptController.js";

const router = express.Router();

/*
all of this should go in middleware/multer
*/
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// For Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  },
});

// File filter (so we have images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload an image"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/process",
  upload.single("receipt"),
  receiptController.processReceipt
);

router.post(
  "/transaction",
  upload.single("receipt"),
  authenticateToken,
  receiptController.createReceiptTransaction
);

router.delete(
  "/:receiptId/:itemId",
  authenticateToken,
  receiptController.deleteReceiptItem
);

router.delete(
  "/:receiptId",
  authenticateToken,
  receiptController.deleteReceipt
);

router.post("/force", authenticateToken, receiptController.manualReceiptMaker);

export default router;
