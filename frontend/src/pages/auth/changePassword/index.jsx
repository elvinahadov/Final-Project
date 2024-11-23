import React, { useState } from "react";
import useAuthStore from "../../../store/authStore";

const ChangePassword = () => {
  const { resetPasswordLoggedIn, error, successMessage } = useAuthStore();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    const result = await resetPasswordLoggedIn(newPassword, newPasswordConfirm);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || "Failed to change password.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-white text-black shadow rounded-lg min-h-screen">
      <h2 className="text-xl font-bold pb-4">Change Your Password</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      <form onSubmit={handlePasswordChange} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-black px-2 py-1 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            className="border px-2 py-1 w-full border-black"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md w-full"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;