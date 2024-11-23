// In your payment routes file
import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentIntent,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/:orderId/payment-intent", getPaymentIntent);

export default router;
