const express = require('express');
const router = express.Router();
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const isloggedin = require("../middlewares/isloggedin");
const cache = require("../controllers/cache"); // shared cache

// Get user profile
router.get("/profile", isloggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get user's cart
router.get("/cart", isloggedin, async (req, res) => {
  try {
    const userEmail = req.user.email;

    const cachedCart = cache.get(userEmail);
    if (cachedCart) return res.status(200).json(cachedCart);

    const user = await userModel.findOne({ email: userEmail }).populate("cart.product", "name image price");
    if (!user) return res.status(404).send("User not found");

    const cartData = user.cart.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      image: item.product.image,
      quantity: item.quantity,
      price: item.price || item.product.price
    }));

    const response = { cart: cartData, cartTotal: user.cartTotal };
    cache.set(userEmail, response);
    res.status(200).json(response);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add to cart
router.post("/addtocart/:id", isloggedin, async (req, res) => {
  try {
    const productId = req.params.id;
    const userEmail = req.user.email;

    const user = await userModel.findOne({ email: userEmail }).populate("cart.product");
    if (!user) return res.status(404).send("User not found");

    const existingProductIndex = user.cart.findIndex(item => item.product._id.toString() === productId);
    if (existingProductIndex > -1) {
      user.cart[existingProductIndex].quantity += 1;
    } else {
      const product = await productModel.findById(productId);
      if (!product) return res.status(404).send("Product not found");
      user.cart.push({ product: product._id, quantity: 1, price: product.price });
    }

    // Update total
    user.cartTotal = user.cart.reduce((sum, item) => {
      const price = item.price || item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);

    await user.save();
    cache.del(userEmail); // clear cache

    res.status(200).json({ message: "Product added to cart successfully", cart: user.cart, cartTotal: user.cartTotal });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Remove from cart
router.post("/removefromcart/:id", isloggedin, async (req, res) => {
  try {
    const productId = req.params.id;
    const userEmail = req.user.email;
    const removeCompletely = req.body.removeCompletely || false;

    const user = await userModel.findOne({ email: userEmail }).populate("cart.product");
    if (!user) return res.status(404).send("User not found");

    const index = user.cart.findIndex(item => item.product._id.toString() === productId);
    if (index > -1) {
      if (removeCompletely || user.cart[index].quantity <= 1) {
        user.cart.splice(index, 1);
      } else {
        user.cart[index].quantity -= 1;
      }

      user.cartTotal = user.cart.reduce((sum, item) => sum + (item.price || item.product.price) * item.quantity, 0);
      await user.save();
      cache.del(userEmail);

      res.status(200).json({ message: "Product removed from cart successfully", cart: user.cart, cartTotal: user.cartTotal });
    } else {
      res.status(404).send("Product not found in cart");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
