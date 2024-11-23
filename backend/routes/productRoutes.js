import express from "express";
import upload from "../middlewares/multer.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", upload.single("productPhoto"), createProduct);

router.put("/:id", upload.single("productPhoto"), updateProduct);

router.delete("/:id", deleteProduct);

router.get("", getAllProducts);

router.get("/:id", getProductById);

export default router;
