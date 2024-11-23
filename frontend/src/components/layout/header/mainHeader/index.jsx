import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import hamburger from "../../../../assets/icons/hamburger.svg";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaUserCircle } from "react-icons/fa";
import useAuthStore from "../../../../store/authStore.js";
import useCartStore from "../../../../store/cartStore";
import { toast } from "react-toastify";

const MainHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLogin, user, isAdmin, initializeLoginState, logout } =
    useAuthStore();
  const { cart, fetchCart, resetCart } = useCartStore();
  const [totalQuantity, setTotalQuantity] = useState(0);

  const navigate = useNavigate();

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/shop" },
    { label: "SALE", href: "/shop/sale" },
    { label: "HELP", href: "/help" },
  ];

  useEffect(() => {
    const initAuth = async () => {
      await initializeLoginState();
      setLoading(false);
    };
    initAuth();
  }, [initializeLoginState]);

  useEffect(() => {
    if (isLogin && user) {
      fetchCart(user._id);
    }
  }, [isLogin, user, fetchCart]);

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(total);
  }, [cart]);

  const handleLogout = async () => {
    await logout();
    resetCart(user._id);
    setTotalQuantity(0);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <div className="px-4 flex justify-center font-azeret shadow-lg">
        <div className="container sm:max-w-[350px] md:max-w-[980px] lg:max-w-[1800px] lg:py-2 mt-2.5 z-30 rounded-[10px] fixed bg-white bg-opacity-80 flex items-center justify-between px-4 py-2 animate-fade-in-up shadow-xl">
          <Link to="/">
            <div className="text-black text-[14px] font-bold leading-[22px] font-azeret">
              SIINAX
            </div>
          </Link>

          <div className="hidden md:flex lg:flex items-center gap-8 font-azeret">
            {navItems.map((item, index) => (
              <Link key={index} to={item.href}>
                <div
                  className={`text-sm font-azeret hover:underline ${
                    window.location.pathname === item.href ? "underline" : ""
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          <div className="md:hidden font-azeret">
            <img
              src={hamburger}
              alt="Hamburger Menu"
              className="text-[30px] cursor-pointer hover:text-[#854DFF]"
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          <div className="flex items-center gap-4 relative font-azeret">
            <div className="sm:hidden md:flex">
              {isLogin && user && user.profilePic ? (
                <img
                  src={user.profilePic.secure_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer object-cover bg-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
              ) : (
                <FaUserCircle
                  className="text-[22px] cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
              )}
            </div>
            <div className="sm:hidden md:flex items-center font-azeret">
              <p className="text-black text-[16px] font-azeret">
                {loading ? "Loading..." : isLogin && user.name}
              </p>
            </div>
            {!isLogin && (
              <Link to={"/login"} className="font-azeret">
                Log in
              </Link>
            )}
            <div>
              <Link to={"/cart"} className="relative">
                <LiaShoppingBagSolid className="text-[24px]" />
                {totalQuantity > 0 && (
                  <span className="absolute top-[10px] right-[-10px] bg-black text-white text-[10px] rounded-full px-1 py-[2px]">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {isLogin && isDropdownOpen && (
            <div className="absolute top-8 right-[10px] mt-2 bg-black opacity-90 rounded-md shadow-lg z-50 font-azeret">
              <div className="p-4">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="block text-white p-2 rounded hover:bg-white hover:text-black"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <div>
                    <Link
                      to="/profile"
                      className="block text-white hover:bg-white hover:text-black p-2 rounded"
                    >
                      Profile
                    </Link>
                    <Link
                    to="/orders"
                    className="block text-white hover:bg-white hover:text-black p-2 rounded"
                  >
                    Orders
                  </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-white hover:bg-white hover:text-black p-2 rounded"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col justify-center items-center font-azeret">
          <button
            className="text-white text-3xl absolute top-4 right-4"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>
          <nav className="flex flex-col items-center gap-8">
            <div className="sm:flex items-center md:hidden text-white flex gap-4">
              {isLogin && user && user.profilePic ? (
                <img
                  src={user.profilePic?.secure_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full bg-center object-cover"
                />
              ) : (
                <FaUserCircle className="text-[22px] text-white" />
              )}
              <p className="text-white text-[24px] font-bold font-azeret">
                {loading ? "Loading..." : isLogin && user.name}
              </p>
            </div>
            <div className="sm:flex md:hidden text-white flex-col gap-2">
              {isLogin && isAdmin && (
                <Link to={"/admin"} className="font-azeret">
                  Admin Dashboard
                </Link>
              )}
              {isLogin ? (
                <button onClick={handleLogout}>Log Out</button>
              ) : (
                <Link to="/login">Log In</Link>
              )}
            </div>
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`text-white text-2xl font-bold font-azeret hover:text-[#854DFF] ${
                  window.location.pathname === item.href
                    ? "text-purple-600"
                    : ""
                }`}
                onClick={() => setIsModalOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default MainHeader;
