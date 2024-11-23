import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QuantitySelector from "../../components/quantitySelector";
import { toast } from "react-toastify";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import { FaRegTrashAlt } from "react-icons/fa";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    fetchCart,
    updateCartQuantity,
    loading,
    error,
  } = useCartStore();
  const { user, isLogin } = useAuthStore();
  const [totalPrice, setTotalPrice] = useState(0);
  const [removalLoading, setRemovalLoading] = useState(null); // New state for removal loading

  useEffect(() => {
    if (isLogin && user) {
      fetchCart(user._id);
    }
  }, [isLogin, user, fetchCart]);

  useEffect(() => {
    if (cart.length > 0) {
      const total = cart.reduce(
        (acc, item) => acc + item.productId.price * item.quantity,
        0
      );
      setTotalPrice(total);
    }
  }, [cart]);

  const handleRemoveItem = async (productId) => {
    if (user) {
      setRemovalLoading(productId); // Set loading state for the item being removed
      await removeFromCart(user._id, productId);
      setRemovalLoading(null); // Reset loading state after removal
      fetchCart(user._id); // Refresh the cart after removal
    }
  };

  const handleQuantityChange = (productId, newQuantity, maxQuantity) => {
    if (newQuantity > maxQuantity) {
      toast.error("Quantity exceeds available stock.");
      return;
    }
    if (user) {
      updateCartQuantity(user._id, productId, newQuantity).then(() => {
        fetchCart(user._id); // Seçilen yeni miktara göre cart'ı güncelle
      });
    }
  };

  const handleCheckout = () => {
    if (!isLogin) {
      toast.error("You need to be logged in to proceed to checkout.");
      return;
    }
    // Proceed to checkout logic (e.g., navigate to checkout page or initiate checkout API)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black font-azeret text-white gap-16 md:py-20 sm:py-20">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-azeret text-white gap-16 sm:py-20 sm:px-5">
      <div className="flex flex-col gap-14 sm:w-full md:w-3/4 lg:w-3/5">
        <div className="flex items-center justify-between sm:hidden md:flex">
          <h1 className="text-sm">Your Cart</h1>
          <Link to="/shop" className="text-white border border-white py-2 px-4">
            Continue Shopping
          </Link>
        </div>
        <div className="flex flex-col gap-8">
          {cart.length === 0 ? (
            <p className="text-white text-center">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center bg-black border border-white gap-4 p-4 sm:flex-col md:flex-row lg:flex-row"
                >
                  <img
                    src={item.productId.productPhoto?.secure_url}
                    alt={item.productId.name}
                    className="sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] object-cover"
                  />
                  <div className="flex flex-col gap-2 sm:w-full md:w-2/3 lg:w-2/3">
                    <p className="text-[14px]">{item.productId.name}</p>
                    <p className="text-[14px]">${item.productId.price}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-[14px]">Quantity</p>
                      <QuantitySelector
                        initialQuantity={item.quantity}
                        min={1}
                        max={item.productId.inStock} // Ensure max is based on stock
                        onChange={(newQuantity) =>
                          handleQuantityChange(
                            item.productId._id,
                            newQuantity,
                            item.productId.inStock
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:mt-4 md:mt-0 lg:mt-0">
                    <button>
                      <FaRegTrashAlt
                        onClick={() => handleRemoveItem(item.productId._id)}
                        disabled={removalLoading === item.productId._id}
                      />
                      {removalLoading === item.productId._id && (
                        <span>Loading...</span>
                      )}
                    </button>
                    <p className="text-[14px]">
                      Total: ${item.productId.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="flex justify-between items-center mt-6 sm:flex-col md:flex-row lg:flex-row">
              <div className="flex flex-col gap-2 sm:w-full md:w-2/3 lg:w-2/3">
                <p className="text-[14px]">Total Price</p>
                <p className="text-[16px]">${totalPrice}</p>
              </div>
              <div className="sm:w-full md:w-[318px] lg:w-[318px]">
                <Link to={"/checkout"}>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white text-[14px] py-[12px] px-[16px] border border-white hover:bg-[#854DFF] hover:border-[#854DFF]"
                  >
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
