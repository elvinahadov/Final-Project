import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
  updateCartQuantity,
  resetCart
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);
router.post("/remove", removeFromCart);
router.post("/update", updateCartQuantity);
router.post("/reset", resetCart);

export default router;
