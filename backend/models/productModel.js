import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    brandId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productInfo: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    productPhoto: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    color: {
      type: String,
    },
    inStock: {
      type: Number,
      required: true,
      min: 0,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    sale: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
