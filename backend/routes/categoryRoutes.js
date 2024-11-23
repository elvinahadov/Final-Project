import express from "express";

import {
  getCategories,
  getSingleCategory,
  deleteCategory,
  editCategory,
  addCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", addCategory);
router.get("/", getCategories);
router.get("/:id", getSingleCategory);
router.patch("/:id", editCategory);
router.delete("/:id", deleteCategory);

export default router;
