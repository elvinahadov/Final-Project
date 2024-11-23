import express from "express";
import {
  addReview,
  getReviews,
  editReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:productId/", getReviews);

router.post("/:productId/", addReview);

router.put("/:productId/reviews/:reviewId", editReview);

router.delete("/:productId/reviews/:reviewId", deleteReview);

export default router;
