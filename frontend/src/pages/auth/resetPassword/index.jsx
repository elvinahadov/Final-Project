import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../../store/authStore"; // Assuming you're using Zustand

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuthStore();
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await resetPassword(token, newPassword, newPasswordConfirm);
    setLoading(false);
    toast.success("Password reset successfully");
    navigate("/login"); // Redirect after success (you can change this)
  };

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired token");
      navigate("/forgot-password"); // Redirect if token is invalid
    }
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-md shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-2 border border-black rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPasswordConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="newPasswordConfirm"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-2 border border-black rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-black text-white rounded-md ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;