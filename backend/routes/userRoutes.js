import express from "express";
import {
  register,
  login,
  verifyOtp,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
  resetPasswordLoggedIn,
  checkAuth,
  getAllUsers,
  updateUserAdminStatus,
  getUserById
} from "../controllers/userController.js";
import { userAuth } from "../middlewares/userAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/logout", userAuth, logout);
router.get("/profile", userAuth, updateProfile);
router.get("/:id", getUserById);
router.patch("/profile",userAuth, upload.single("profilePic"), updateProfile);
router.get("/check-auth", userAuth, checkAuth);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/reset-password-logged-in", userAuth, resetPasswordLoggedIn);
router.get("/all-users", userAuth, adminAuth, getAllUsers);
router.put("/:userId/admin", userAuth, adminAuth, updateUserAdminStatus);

export default router;
