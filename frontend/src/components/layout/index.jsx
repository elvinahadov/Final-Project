import { useLocation } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

const Layout = ({ children }) => {
  const location = useLocation();

  const excludePaths = [
    "/login",
    "/register",
    "/verify-otp",
    "/admin",
    "/admin/users",
    "/admin/products",
    "/admin/products/add",
    "/admin/brands",
    "/admin/brands/add",
    "/admin/categories",
    "/admin/categories/add",
    "/admin/faq",
    "/admin/orders",
    "/admin/faq/add",
  ];

  const shouldRenderLayout =
    !excludePaths.includes(location.pathname) &&
    !location.pathname.startsWith("/admin/products/edit");

  return shouldRenderLayout ? (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  ) : (
    <>{children}</>
  );
};

export default Layout;
