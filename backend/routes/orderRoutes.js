import express from "express";
import {
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  createOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder); // Create a new order
router.get("/:userId", getUserOrders); // Get orders for a user
router.get("/", getAllOrders); // Get all orders (Admin)
router.patch("/update-status", updateOrderStatus); // Update the status of an order

export default router;
