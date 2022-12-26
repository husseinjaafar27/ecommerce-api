const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Owner = require("../models/ownerModel");
const Product = require("../models/productmodel");

exports.newCart = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const owner = await Owner.findById(req.body.userId);
    if (!(user || owner)) {
      res.status(400).json({ message: "Cart must belong to the user" });
    }
    const newCart = await Cart.create({
      userId: req.body.userId,
    });
    res
      .status(201)
      .json({ message: "Your cart is ready !! check it", data: newCart });
  } catch (err) {
    console.log(err);``
  }
};

exports.addRemoveOnCart = async (req, res) => {
  try {
    const cartUser = await User.findById(req.body.userId);
    const cartOwner = await Owner.findById(req.body.userId);
    if (!(cartUser || cartOwner)) {
      res.status(400).json({ message: "Cart must belong the user" });
    }
    const addProduct = await Cart.findById(req.params.id);
    if (!addProduct) {
      res.status(400).json({ message: "cart is not exist" });
    }
    if (!addProduct.product.includes(req.body.currentProductId)) {
      await addProduct.updateOne({
        $push: { product: req.body.currentProductId },
      });
      res.status(200).json({message:"Product has been added !! Check your cart"});
    } else {
      await addProduct.updateOne({
        $pull: { product: req.body.currentProductId },
      });
      res.status(201).json({message:"Product has been removed !! Check your cart"});
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cartUser = await User.findById(req.body.userId);
    const cartOwner = await Owner.findById(req.body.userId);
    if (!(cartUser || cartOwner)) {
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
