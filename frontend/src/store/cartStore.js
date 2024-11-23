import { toast } from "react-toastify";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  error: null,

  // Action to fetch cart data
  fetchCart: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:6262/api/cart?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      set({ cart: data.cart });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Action to add product to the cart
  addToCart: async (userId, productId, quantity) => {
    const cart = get().cart;
    const existingProduct = cart.find(
      (item) => item.productId._id === productId
    );

    // Check if the quantity exceeds the available stock
    const productResponse = await fetch(
      `http://localhost:6262/api/products/${productId}`
    );
    const productData = await productResponse.json();
    const availableStock = productData.product.inStock;

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantity;
      if (newQuantity > availableStock) {
        toast.error(
          `You cannot add more than ${availableStock} of this product.`
        );
        return;
      }
    } else {
      if (quantity > availableStock) {
        toast.error(
          `You cannot add more than ${availableStock} of this product.`
        );
        return;
      }
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      const data = await response.json();
      set({ cart: data.cart });
      toast.success("Product added to cart!");
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to add product to cart.");
    } finally {
      set({ loading: false });
    }
  },

  // Action to remove product from the cart
  removeFromCart: async (userId, productId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product from cart");
      }

      const data = await response.json();
      set({ cart: data.cart });
      toast.success("Product removed from cart!");
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to remove product from cart.");
    } finally {
      set({ loading: false });
    }
  },

  // Action to update quantity of an item in the cart
  updateCartQuantity: async (userId, productId, quantity) => {
    const cart = get().cart;
    const existingProduct = cart.find(
      (item) => item.productId._id === productId
    );

    // Check if the updated quantity exceeds available stock
    const productResponse = await fetch(
      `http://localhost:6262/api/products/${productId}`
    );
    const productData = await productResponse.json();
    const availableStock = productData.product.inStock;

    if (existingProduct && quantity > availableStock) {
      toast.error(
        `You cannot add more than ${availableStock} of this product.`
      );
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (!response.ok) {
        throw new Error(
          "You cannot add more than ${availableStock} of this product"
        );
      }

      const data = await response.json();
      set({ cart: data.cart });
      toast.success("Cart quantity updated!");
    } catch (error) {
      set({ error: error.message });
      toast.error("You cannot add more than ${availableStock} of this product");
    } finally {
      set({ loading: false });
    }
  },

  resetCart: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/cart/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset cart");
      }

      const data = await response.json();
      set({ cart: data.cart });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCartStore;
