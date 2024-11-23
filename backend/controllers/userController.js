import { User } from "../models/userModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PassThrough } from "stream";
import cloudinary from "../config/cloudinaryConfig.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const register = async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields!" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();

    const user = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });
    await user.save();

    const mailOptions = {
      from: "Elvin Ahadov",
      to: email,
      subject: "Email Verification",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333333; text-align: center;">Welcome to Our Site, ${name}!</h2>
          <p style="font-size: 16px; color: #555555;">Thanks for signing up! Please use the following OTP to verify your email address:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #ffffff; background-color: #ff4500; padding: 10px 20px; border-radius: 5px;">${otp}</span>
          </div>
          <p style="font-size: 16px; color: #555555;">This OTP is valid for 5 minutes. If you did not sign up for an account, please ignore this email.</p>
          <p style="font-size: 14px; color: #999999; text-align: center;">Best regards,<br/>Elvin Ahadov</p>
        </div>
      </div>`,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Registration successful. Please verify your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findOne({
      otp: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "OTP is invalid or expired!" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "OTP verified successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in successfully!",
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  const { name, surname, email, oldProfilePhotoPublicId } = req.body;
  const profilePic = req.file;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) {
      return res.status(400).json({ message: "Email cannot be changed" });
    }

    let updatedProfilePic;

    if (profilePic) {
      try {
        const passThroughStream = new PassThrough();
        passThroughStream.end(profilePic.buffer);

        const result = await new Promise((resolve, reject) => {
          passThroughStream.pipe(
            cloudinary.uploader.upload_stream(
              { folder: "user_profile_pics" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
          );
        });

        updatedProfilePic = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };

        if (oldProfilePhotoPublicId) {
          await cloudinary.uploader.destroy(oldProfilePhotoPublicId);
        }

        user.profilePic = updatedProfilePic;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: "Elvin Ahadov",
      to: email,
      subject: "Forgot Password",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333333; text-align: center;">Password Reset</h2>
          <p style="font-size: 16px; color: #555555;">It looks like you requested to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" 
               style="background-color: #ff4500; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 16px; color: #555555;">If you did not request this, please ignore this email.</p>
          <p style="font-size: 14px; color: #999999; text-align: center;">Best regards,<br/>Elvin Ahadov</p>
        </div>
      </div>`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword, newPasswordConfirm } = req.body;

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const token = req.params.token;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const resetPasswordLoggedIn = async (req, res) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (newPassword !== newPasswordConfirm) {
    return res.status(401).json({ message: "New passwords do not match" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const updateUserAdminStatus = async (req, res) => {
  const { userId } = req.params;
  const { isAdmin } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res
      .status(200)
      .json({ message: "User admin status updated successfully.", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user admin status.", error });
  }
};
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching user: " + error.message });
  }
};
