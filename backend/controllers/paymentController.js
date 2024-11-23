import Stripe from "stripe";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent with the provided order details
export const createPaymentIntent = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;

    // Calculate the total amount
    const amount = products.reduce((total, item) => {
      const price = item.productId.price;
      const quantity = item.quantity;
      return total + price * quantity;
    }, 0);

    // Create a payment intent with Stripe and enable automatic payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true, // Automatically selects the payment method
      },
      metadata: {
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    // Respond with the client secret and paymentIntent ID
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Confirm the payment and handle the order process
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment failed or not yet confirmed.",
      });
    }

    // Process order and stock updates
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // Update product stock and order status
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found with ID ${item.productId}`,
        });
      }

      if (product.inStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}.`,
        });
      }

      product.inStock -= item.quantity;
      await product.save();
    }

    order.isPaid = true;
    order.paymentStatus = "paid";
    order.paymentDate = new Date();
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve payment intent for the order
export const getPaymentIntent = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.paymentIntentId
    );

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error fetching payment intent:", error);
    res.status(500).json({ error: "Error fetching payment details" });
  }
};
