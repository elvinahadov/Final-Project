import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useProductStore from "../../store/prodStore";
import QuantitySelector from "../../components/quantitySelector/index";
import useCartStore from "../../store/cartStore"; // Importing the cart store
import { toast } from "react-toastify";
import useAuthStore from "../../store/authStore";
import useOrderStore from "../../store/orderStore";
import ReviewSection from "../../components/reviewSection";

const DetailPage = () => {
  const { getProductById } = useProductStore();
  const { addToCart, cart, loading } = useCartStore(); // Destructuring addToCart from store
  const { user, initializeLoginState, isLogin } = useAuthStore();
  const { fetchUserOrders, orders } = useOrderStore();
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate(); // Initialize navigate hook

  const [isProductInfoOpen, setProductInfoOpen] = useState(false);
  const [isReturnRefundOpen, setReturnRefundOpen] = useState(false);
  const [isShippingInfoOpen, setShippingInfoOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id, getProductById]);

  useEffect(() => {
    if (!isLogin) {
      initializeLoginState();
    } else {
      fetchUserOrders(user._id);
    }
  }, [isLogin, initializeLoginState, user, fetchUserOrders]);

  if (!product) return <p className="text-white">Product not found.</p>;

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!isLogin) {
      toast.error("You need to be logged in to add products to the cart.");
      return;
    }

    try {
      // Add the product to the cart store
      await addToCart(user._id, product._id, quantity);
      toast.success("Product added to cart!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyNow = async () => {
    if (!isLogin) {
      toast.error("You need to be logged in to proceed to checkout.");
      return;
    }

    // Add the product directly to the cart and navigate to checkout
    await addToCart(user._id, product._id, quantity); // Add product to cart store

    // After adding to the cart, navigate to the checkout page
    navigate("/checkout", { state: { cart } }); // Pass the cart data to the checkout page
  };

  const toggleProductInfo = () => {
    setProductInfoOpen((prev) => !prev);
  };

  const toggleReturnRefund = () => {
    setReturnRefundOpen((prev) => !prev);
  };

  const toggleShippingInfo = () => {
    setShippingInfoOpen((prev) => !prev);
  };

  const staticReturnPolicy =
    "You can return any product within 30 days for a full refund.";
  const staticShippingInfo =
    "We offer free standard shipping on all orders over $200.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-azeret text-white gap-16 md:py-20 sm:py-20">
      <div className="flex flex-col gap-14">
        <div className="flex items-center justify-between sm:hidden md:flex">
          <h1 className="text-sm">{product.name}</h1>
          <Link
            to={"/shop"}
            className="text-white border border-white py-2 px-4"
          >
            See All Products
          </Link>
        </div>
        <div className="flex justify-center items-center gap-16 md:flex-col lg:flex-row sm:flex-col">
          <img
            src={product.productPhoto.secure_url}
            alt="product"
            className="sm:w-[338px] sm:h-[338px] lg:w-[741px] lg:h-[741px] md:w-[640px] md:h-[640px]"
          />
          <div className="sm:px-3 sm:max-w-[350px] md:max-w-[640px] lg:w-[741px] flex flex-col gap-4">
            <p className="text-[17px]">{product.name}</p>
            <p className="text-[14px]">${product.price}</p>
            <p className="text-[14px]">{product.description}</p>
            <div className="flex flex-col gap-3">
              <p className="text-[14px] text-white">Quantity</p>
              <QuantitySelector
                initialQuantity={1}
                min={1}
                max={product.inStock || 100}
                onChange={handleQuantityChange}
              />
            </div>
            <div className="w-full flex items-center gap-3 mb-4 sm:flex-col md:flex-col lg:flex-row">
              <button
                className="sm:w-full md:w-full lg:w-[318px] bg-black border border-white text-[14px] py-[12px] px-[16px] hover:bg-[#854DFF] hover:border-[#854DFF]"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add to Cart"}
              </button>
              <button
                className="sm:w-full md:w-full lg:w-[318px] text-black bg-white border border-white text-[14px] py-[12px] px-[16px] hover:bg-black hover:text-white"
                onClick={handleBuyNow} // Added Buy Now button logic
              >
                Buy Now
              </button>
            </div>
            <div>
              {/* Product Info Toggle */}
              <div
                className="flex items-center justify-between mb-3 cursor-pointer"
                onClick={toggleProductInfo}
              >
                <h1 className="text-[18px]">Product Information</h1>
                <span>{isProductInfoOpen ? "+" : "-"}</span>
              </div>
              {isProductInfoOpen && (
                <div className="text-[15px]">{product.productInfo}</div>
              )}

              <div
                className="flex items-center justify-between mb-3 cursor-pointer"
                onClick={toggleReturnRefund}
              >
                <h1 className="text-[18px]">Return & Refund</h1>
                <span>{isReturnRefundOpen ? "+" : "-"}</span>
              </div>
              {isReturnRefundOpen && (
                <div className="text-[15px]">{staticReturnPolicy}</div>
              )}

              {/* Shipping Info Toggle */}
              <div
                className="flex items-center justify-between mb-3 cursor-pointer"
                onClick={toggleShippingInfo}
              >
                <h1 className="text-[18px]">Shipping Information</h1>
                <span>{isShippingInfoOpen ? "+" : "-"}</span>
              </div>
              {isShippingInfoOpen && (
                <div className="text-[15px]">{staticShippingInfo}</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ReviewSection productId={product._id} userId={user?._id} />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;