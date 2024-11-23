import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID (excluding the password field)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request object for subsequent route access
    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    // Check if the error was a malformed token or expired token
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token. Please log in again." });
    } else if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    } else {
      return res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
    }
  }
};
