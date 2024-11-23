import { create } from "zustand";
import { toast } from "react-toastify";

const useAuthStore = create((set) => ({
  isLogin: false,
  isAdmin: false,
  user: null,
  loading: true,
  error: null,
  successMessage: null,
  users: [],

  initializeLoginState: async () => {
    set({ loading: true });
    try {
      const response = await fetch("http://localhost:6262/api/users/profile", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        set({
          isLogin: true,
          user: data.user,
          isAdmin: data.user.isAdmin || false,
          error: null,
          loading: false,
        });
      } else {
        set({ isLogin: false, user: null, isAdmin: false, loading: false });
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      set({ isLogin: false, user: null, isAdmin: false, loading: false });
    }
  },
  fetchUserById: async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:6262/api/users/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        return data;
      } else {
        console.error("Error fetching user:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch(
        "http://localhost:6262/api/users/all-users",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        set({ users: data.data, error: null });
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: "Failed to fetch users. Please try again." });
    } finally {
      set({ loading: false });
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch("http://localhost:6262/api/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  },

  verifyOtp: async (otp) => {
    try {
      const response = await fetch(
        "http://localhost:6262/api/users/verify-otp",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        set({
          isLogin: true,
          user: data.data,
          error: null,
          successMessage: data.message,
        });
        await useAuthStore.getState().initializeLoginState();
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      set({ error: "OTP verification failed. Please try again." });
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch("http://localhost:6262/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        await useAuthStore.getState().initializeLoginState();
        return { success: true, user: result.user };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "Something went wrong." };
    }
  },

  logout: async () => {
    try {
      const response = await fetch("http://localhost:6262/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        set({
          isLogin: false,
          user: null,
          error: null,
          successMessage: "Logged out successfully",
        });
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await fetch(
        "http://localhost:6262/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        set({ successMessage: data.message, error: null });
        toast.success("Reset link sent successfully");
      } else {
        set({ error: data.message });
        toast.error("Failed to send reset link");
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      set({ error: "Failed to send reset link. Please try again." });
    }
  },

  resetPassword: async (token, newPassword, newPasswordConfirm) => {
    if (newPassword !== newPasswordConfirm) {
      set({ error: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:6262/api/users/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword, newPasswordConfirm }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        set({ successMessage: data.message, error: null });
        toast.success("Password reset successfully");
      } else {
        set({ error: data.message });
        toast.error("Failed to reset password");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      set({ error: "Password reset failed. Please try again." });
    }
  },

  resetPasswordLoggedIn: async (newPassword, newPasswordConfirm) => {
    if (newPassword !== newPasswordConfirm) {
      set({ error: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:6262/api/users/reset-password-logged-in",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword, newPasswordConfirm }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        set({ successMessage: data.message, error: null });
        toast.success("Password changed successfully");
      } else {
        set({ error: data.message });
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.error("Error during logged-in password change:", error);
      set({ error: "Password change failed. Please try again." });
    }
  },

  updateUserAdminStatus: async (userId, isAdmin) => {
    try {
      const response = await fetch(
        `http://localhost:6262/api/users/${userId}/admin`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isAdmin }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        set((state) => ({
          users: state.users.map((user) =>
            user._id === userId ? { ...user, isAdmin } : user
          ),
        }));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error updating user admin status:", error);
      return { success: false, message: "Failed to update admin status." };
    }
  },
  updateProfile: async (userData, profilePic, oldProfilePhotoPublicId) => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("surname", userData.surname);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      if (oldProfilePhotoPublicId) {
        formData.append("oldProfilePhotoPublicId", oldProfilePhotoPublicId);
      }

      const response = await fetch("http://localhost:6262/api/users/profile", {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        set({ user: data.user, successMessage: data.message });
        toast.success("Profile updated successfully.");
        return { success: true, message: data.message };
      } else {
        toast.error("Failed to update profile.");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      toast.error("Failed to update profile.");
      return {
        success: false,
        message: "Profile update failed. Please try again.",
      };
    }
  },
}));

export default useAuthStore;
