const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Owner = require("../models/ownerModel");

exports.newOrder = async (req, res) => {
  try {
    const owner = await Owner.findById(req.body.userId);
    if (!owner) {
      res.status(400).json({ message: "Order must belong to the user" });
    }
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder);
  } catch (err) {
    console.log(err);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const owner = await Owner.findById(req.body.userId);
    if (!owner) {
      res.status(400).json({ message: "Order must belong to the user" });
    }
    const newOrder = await Order.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    if (newOrder) {
      return res.status(201).json({
        message: "new updated product created successfully",
        data: newOrder,
      });
    }
    return res.status(400).json({ message: "Order not found" });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const OrderOwner = await Owner.findById(req.body.userId);
    if (!OrderOwner) {
      return res
        .status(400)
        .json({ message: "A Order must belong to the user" });
    }
    const order = await Order.findById(req.body.cartId);
    if (!order) {
      return res.status(400).json({ message: "Order is exist " });
    }
    await Order.findByIdAndDelete(req.body.cartId);

    res.status(201).json({ message: "Order has been deleted !!" });
  } catch (err) {
    console.log(err);
  }
};
