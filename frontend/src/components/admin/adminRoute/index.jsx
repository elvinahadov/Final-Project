import React, { useEffect } from "react";
import useAuthStore from "../../../store/authStore";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { isLogin, user, loading, initializeLoginState } = useAuthStore();

  useEffect(() => {
    if (!isLogin && !user) {
      initializeLoginState();
    }
  }, [isLogin, user, initializeLoginState]);

  if (loading) {
    return null;
  }

  if (!isLogin || !user?.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
