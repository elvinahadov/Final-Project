import { Order } from "../models/orderModel.js";

// Create a new order
export const createOrder = async (req, res) => {
  const { userId, products, shippingAddress, totalPrice, paymentIntentId } =
    req.body;

  try {
    const newOrder = new Order({
      userId,
      products,
      shippingAddress,
      totalPrice,
      paymentIntentId,
      isPaid: false,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user orders", error: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch all orders", error: error.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};
