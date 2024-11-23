import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useOrderStore from "../../store/orderStore";
import usePaymentStore from "../../store/paymentStore";
import { toast } from "react-toastify";
import useCartStore from "../../store/cartStore";

const Checkout = () => {
  const { cart, loading: cartLoading, fetchCart, resetCart } = useCartStore();
  const { user, isLogin } = useAuthStore();
  const { createOrder } = useOrderStore();
  const { createPaymentIntent, loading: paymentLoading } = usePaymentStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (isLogin && user) {
      fetchCart(user._id);
    }
  }, [isLogin, user, fetchCart]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      toast.error("Please fill in all shipping fields.");
      return;
    }

    if (!cart.length) {
      toast.error("Your cart is empty.");
      return;
    }

    let totalPrice = 0;
    for (const item of cart) {
      const price = parseFloat(item.productId.price);
      const quantity = parseInt(item.quantity, 10);

      if (isNaN(price) || isNaN(quantity)) {
        toast.error(`Invalid price or quantity for ${item.productId.name}`);
        return;
      }

      totalPrice += price * quantity;
    }

    try {
      // Create the payment intent
      const response = await createPaymentIntent(
        user._id,
        cart,
        shippingAddress
      );

      // Check if the response is valid
      if (!response || !response.clientSecret || !response.paymentIntentId) {
        throw new Error(
          "Payment intent creation failed. No client secret or paymentIntentId returned."
        );
      }

      const { clientSecret, paymentIntentId } = response;

      const orderData = {
        userId: user._id,
        shippingAddress,
        products: cart.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        totalPrice: totalPrice.toFixed(2),
        paymentIntentId: paymentIntentId,
      };

      // Send orderData to create the order
      const newOrder = await createOrder(orderData);

      console.log("New Order:", newOrder);

      if (!newOrder || !newOrder._id) {
        throw new Error("Order creation failed, _id not returned.");
      }
      resetCart(user._id);

      navigate(`/payment/${newOrder._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(`Order creation failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cart Section */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cartLoading ? (
            <p className="text-gray-500">Loading cart...</p>
          ) : cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <img
                    src={item.productId.productPhoto?.secure_url}
                    alt={item.productId.name}
                    className="w-20 h-20 rounded-sm"
                  />
                  <div>
                    <p className="text-lg font-medium">{item.productId.name}</p>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shipping Section */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <form className="space-y-4" onSubmit={handleOrderSubmit}>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleShippingChange}
              placeholder="Address"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleShippingChange}
              placeholder="City"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleShippingChange}
              placeholder="Postal Code"
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              name="country"
              value={shippingAddress.country}
              onChange={handleShippingChange}
              placeholder="Country"
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="submit"
              disabled={paymentLoading}
              className={`px-6 py-3 font-semibold text-white rounded-lg ${
                paymentLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {paymentLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
