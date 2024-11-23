import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import VerifyOtpPage from "./pages/auth/verifyOtp";
import HomePage from "./pages/home";
import { ToastContainer } from "react-toastify";
import AdminRoute from "./components/admin/adminRoute";
import Admin from "./pages/admin";
import UsersPage from "./pages/admin/users";
import ProductsPage from "./pages/admin/products";
import BrandsPage from "./pages/admin/brands";
import Addbrand from "./pages/admin/brands/addBrand";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";
import Categories from "./pages/admin/categories";
import AddCategory from "./pages/admin/categories/addCategory";
import AddProduct from "./pages/admin/products/addProduct";
import EditProduct from "./pages/admin/products/editProduct";
import Shop from "./pages/shop";
import DetailPage from "./pages/detailPage";
import CartPage from "./pages/cart";
import UserProfile from "./components/userProfile";
import ResetPassword from "./pages/auth/resetPassword";
import ForgotPassword from "./pages/auth/forgotPasword";
import ChangePassword from "./pages/auth/changePassword";
import Faq from "./pages/admin/faq";
import AddFaq from "./pages/admin/faq/addFaq";
import Faqs from "./pages/faq";
import Checkout from "./pages/checkout";
import PaymentPage from "./pages/payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import UserOrder from "./pages/orders";
import Orders from "./pages/admin/orders";

// Load the Stripe public key
const stripePromise = loadStripe(
  "pk_test_51QO2A9LLRJ67uglnwYJlDnYo53HbwLjznTU43QZnzMZAumm1cmbtDOOMPOjgsuDQC4Q8nRKgZXnqDztQutn2H8RN008P3Mn4jc"
);

function App() {
  const { initializeLoginState } = useAuthStore();

  useEffect(() => {
    initializeLoginState();
  }, [initializeLoginState]);

  return (
    <Layout>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/product/:id" element={<DetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<UserOrder />} />

        {/* Wrap PaymentPage with Elements provider */}
        <Route
          path="/payment/:orderId"
          element={
            <Elements stripe={stripePromise}>
              <PaymentPage />
            </Elements>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        >
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/add" element={<Addbrand />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="faq" element={<Faq />} />
          <Route path="faq/add" element={<AddFaq />} />
          <Route path="categories/add" element={<AddCategory />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;