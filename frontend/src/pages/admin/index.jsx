import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import AdminProfile from "../../components/userProfile";

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  const isAdminRoute = location.pathname === "/admin";

  return (
    <div className="flex min-h-screen font-azeret overflow-hidden relative">
      <aside
        className={`fixed top-0 left-0 bg-black text-white h-full w-64 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0 z-50" : "-translate-x-full"}
          sm:z-50
        `}
      >
        <div className="flex flex-col items-center p-4 h-full">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={`text-white mb-4 self-end ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-6">Admin</h2>
          <ul className="w-full">
            <li className="my-4 hover:bg-white hover:text-black p-2 rounded flex items-center">
              <Link
                to="/admin/products"
                className="flex items-center gap-2 w-full"
              >
                Products
              </Link>
            </li>
            <li className="my-4 hover:bg-white hover:text-black p-2 rounded flex items-center">
              <Link
                to="/admin/categories"
                className="flex items-center gap-2 w-full"
              >
                Categories
              </Link>
            </li>
            <li className="my-4 hover:bg-white hover:text-black p-2 rounded flex items-center">
              <Link
                to="/admin/brands"
                className="flex items-center gap-2 w-full"
              >
                Brands
              </Link>
            </li>
            <li className="my-4 hover:bg-white hover:text-black p-2 rounded flex items-center">
              <Link
                to="/admin/faq"
                className="flex items-center gap-2 w-full"
              >
                FAQs
              </Link>
            </li>
            <li className="my-4 hover:bg-white hover:text-black p-2 rounded flex items-center">
              <Link
                to="/admin/orders"
                className="flex items-center gap-2 w-full"
              >
                Orders
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-80 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main
        className={`bg-gray-100 p-4 transition-all duration-300 ease-in-out flex-1
          ${isSidebarOpen ? "ml-0" : "ml-0"}
          md:${isSidebarOpen ? "ml-64" : "ml-0"}
          lg:${isSidebarOpen ? "ml-64" : "ml-0"}
        `}
      >
        <header className="flex items-center justify-between bg-white shadow-lg p-4 rounded-lg mb-6 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-2 bg-black text-white rounded-md ${
              isSidebarOpen ? "hidden" : "block"
            }`}
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">Welcome, Admin</h1>
          <Link
            to="/"
            className="text-center px-3 py-2 bg-black text-white rounded-md"
          >
            Go Back
          </Link>
        </header>
        {isAdminRoute ? <AdminProfile user={user} /> : <Outlet />}
      </main>
    </div>
  );
};

export default Admin;
