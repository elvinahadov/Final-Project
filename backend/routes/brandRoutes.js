import express from "express";
import multer from "multer";
import {
  addBrand,
  getBrands,
  deleteBrand,
} from "../controllers/brandController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("logo"), addBrand);
router.get("/", getBrands);
router.delete("/:id", deleteBrand);

export default router;
