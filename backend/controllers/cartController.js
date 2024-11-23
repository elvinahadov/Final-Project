import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res
      .status(400)
      .json({ message: "User ID, product ID, and quantity are required" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity exceeds the available stock
    if (quantity > product.inStock) {
      return res
        .status(400)
        .json({ message: `Only ${product.inStock} items available in stock` });
    }

    // Check if the product is already in the user's cart
    const existingProductIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // If product is already in the cart, update the quantity
      const currentQuantity = user.cart[existingProductIndex].quantity;
      const newQuantity = currentQuantity + quantity;

      // Ensure the new quantity does not exceed available stock
      if (newQuantity > product.inStock) {
        return res.status(400).json({
          message: `Only ${product.inStock} items available in stock`,
        });
      }
      user.cart[existingProductIndex].quantity = newQuantity;
    } else {
      // If product is not in the cart, add it
      user.cart.push({ productId, quantity });
    }

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error adding product to cart" });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "User ID and product ID are required" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product in the cart and remove it
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "Product removed from cart", cart: user.cart });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error removing product from cart" });
  }
};
export const getCart = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the cart items with populated product data
    return res.status(200).json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching cart" });
  }
};
export const updateCartQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res
      .status(400)
      .json({ message: "User ID, product ID, and quantity are required" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity exceeds the available stock
    if (quantity > product.inStock) {
      return res
        .status(400)
        .json({ message: `Only ${product.inStock} items available in stock` });
    }

    // Find the product in the user's cart
    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity of the product in the cart
    cartItem.quantity = quantity;

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "Cart quantity updated", cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating cart quantity" });
  }
};
export const resetCart = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];

    await user.save();

    return res
      .status(200)
      .json({ message: "Cart has been reset", cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error resetting cart" });
  }
};
