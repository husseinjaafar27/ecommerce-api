const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Owner = require("../models/ownerModel");

exports.newOrder = async (req, res) => {
  try {
    const userOrder = await User.findById(req.body.userId);
    const ownerOrder = await Owner.findById(req.body.userId);
    if (!(userOrder || ownerOrder)) {
      res.status(400).json({ message: "Order must belong to the user" });
    }
    const newOrder = await Cart.findById(req.params.id);
    if (!newOrder) {
      res.status(400).json({ message: "cart is not exist" });
    }

  } catch (err) {
    console.log(err);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderUser = await User.findById(req.body.userId);
    const orderOwner = await Owner.findById(req.body.userId);
    if (!(orderUser || orderOwner)) {
      return res
        .status(400)
        .json({ message: "Order must belong to the user" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(400).json({ message: "Cart is exist " });
    }
    await Order.findByIdAndDelete(req.params.id);

    res.status(201).json({ message: "Cart has been deleted !!" });
  } catch (err) {
    console.log(err);
  }
};