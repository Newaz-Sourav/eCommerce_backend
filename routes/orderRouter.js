const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const isloggedin = require("../middlewares/isloggedin");
const User = require("../models/userModel");
const isOwnerLoggedin = require("../middlewares/isOwnerLoggedin");
const { route } = require("./userRouter");


router.get("/orders", isOwnerLoggedin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items.product", // populate product details inside items
        select: "name image price" // include name, image, price
      })
      .exec();

    // Format response
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      name: order.name,
      email: order.email,
      location: order.location,
      phone: order.phone,
      items: order.items.map(item => ({
        productName: item.product?.name || "Unknown",
        productImage: item.product?.image || "",
        productPrice: item.product?.price || 0,
        quantity: item.quantity
      })),
      totalPrice: order.totalPrice,
      orderDate: order.orderDate,
      orderStatus: order.order_status
    }));

    res.json(formattedOrders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Place an order (Protected Route)
router.post("/placeorder", isloggedin, async (req, res) => {
  try {
    const { name, email, location,phone } = req.body;
    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    //  cart total হিসাব করা
    const cartTotal = user.cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Create order
    const newOrder = new Order({
      user: user._id,
      name,
      email,
      location,
      phone,
      items: user.cart,
      totalPrice: cartTotal
    });

    await newOrder.save();

    // Clear cart
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/order_status/:id", isloggedin, async (req, res) => {
  try {
    const orderid = req.params.id;
    const { status } = req.body;

    // find order
    const SelectedOrder = await Order.findById(orderid);
    if (!SelectedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // update status
    SelectedOrder.order_status = status;

    // save with await
    await SelectedOrder.save();

    res.status(200).json({
      message: "Order status updated successfully",
  
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
