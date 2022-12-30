const Cart = require("../models/cartModel");
const Owner = require("../models/ownerModel");
const Product = require("../models/productmodel");

exports.newCart = async (req, res) => {
  try {
    const owner = await Owner.findById(req.body.userId);
    if (!owner) {
      res.status(400).json({ message: "Cart must belong to the user" });
    }
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    return res.status(200).json(savedCart);
  } catch (err) {
    console.log(err);
  }
};

exports.updateCart = async (req, res) => {
  try {
    const owner = await Owner.findById(req.body.userId);
    if (!owner) {
      res.status(400).json({ message: "Cart must belong to the user" });
    }
    const newCart = await Cart.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    if (newCart) {
      return res.status(201).json({
        message: "new updated product created successfully",
        data: newCart,
      });
    }
    return res.status(400).json({ message: "cart not found" });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cartOwner = await Owner.findById(req.body.userId);
    if (!cartOwner) {
      return res
        .status(400)
        .json({ message: "A cart must belong to the user" });
    }
    const cart = await Cart.findById(req.body.cartId);
    if (!cart) {
      return res.status(400).json({ message: "Cart is exist " });
    }
    await Cart.findByIdAndDelete(req.body.cartId);

    res.status(201).json({ message: "Cart has been deleted !!" });
  } catch (err) {
    console.log(err);
  }
};
