import { create } from "zustand";
import { toast } from "react-toastify";

const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchUserOrders: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:6262/api/orders/${userId}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch user orders");
      set({ orders: data });
    } catch (error) {
      set({ error: error.message });
      toast.error("Could not retrieve user orders.");
    } finally {
      set({ loading: false });
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/orders");
      if (!response.ok) throw new Error("Failed to fetch all orders");
      const data = await response.json();
      set({ orders: data });
    } catch (error) {
      set({ error: error.message });
      toast.error("Could not retrieve all orders.");
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to create order");

      const newOrder = await response.json();

      // Ensure newOrder contains the _id
      if (!newOrder || !newOrder._id) {
        throw new Error("Order creation failed, _id not returned.");
      }

      set((state) => ({
        orders: [...state.orders, newOrder],
      }));
      toast.success("Order successfully created!");

      return newOrder; // Make sure to return the full order with _id
    } catch (error) {
      set({ error: error.message });
      toast.error("Order creation failed.");
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:6262/api/orders/update-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update order status");
      const updatedOrder = await response.json();

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? updatedOrder : order
        ),
      }));
      toast.success("Order status successfully updated!");
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to update order status.");
    } finally {
      set({ loading: false });
    }
  },

  resetOrders: () => set({ orders: [], error: null, loading: false }),
}));

export default useOrderStore;
