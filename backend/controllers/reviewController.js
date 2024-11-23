import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

export const addReview = async (req, res) => {
  const { productId } = req.params;
  const { userId, rating, comment } = req.body;
  try {
    const order = await Order.findOne({
      userId,
      "products.productId": productId,
      paymentStatus: "paid",
    });

    if (!order) {
      return res.status(403).json({
        error: "You must purchase this product to write a review.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Check if the user has already reviewed this product
    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === userId
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this product." });
    }

    // Create a new review
    const newReview = { userId, rating, comment };
    product.reviews.push(newReview);

    // Update the product
    await product.save();

    res.status(201).json({
      message: "Review added successfully.",
      reviews: product.reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
};

// Get all reviews for a product
export const getReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate(
      "reviews.userId",
      "name"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ reviews: product.reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
};
// Delete Review Controller
export const deleteReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  const { userId } = req.body;
  console.log(req.body);

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const reviewIndex = product.reviews.findIndex(
      (review) =>
        review._id.toString() === reviewId &&
        review.userId.toString() === userId
    );

    if (reviewIndex === -1) {
      return res.status(403).json({
        error: "Review not found or you don't have permission to delete it.",
      });
    }

    // Remove the review from the product's reviews array
    product.reviews.splice(reviewIndex, 1);

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
};

export const editReview = async (req, res) => {
  const { productId, reviewId } = req.params;
  const { rating, comment, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }
    console.log(review.userId,"",userId)

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this review." });
    }

    // Update the review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await product.save();

    res.status(200).json({ message: "Review updated successfully!", review });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the review." });
  }
};
