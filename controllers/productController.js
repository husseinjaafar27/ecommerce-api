const Product = require("../models/productmodel");
const Owner = require("../models/ownerModel");
const User = require("../models/userModel");

exports.createProduct = async (req, res) => {
  try {
    const productOwner = await Owner.findById(req.body.ownerID);
    if (!productOwner) {
      return res
        .status(400)
        .json({ message: "A product must belong to the owner" });
    }
    const newProduct = await Product.create({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      categories: req.body.categories,
      price: req.body.price,
      rating: req.body.rating,
    });

    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  } catch (err) {
    console.log(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productOwner = await Owner.findById(req.body.product);
    if (!productOwner) {
      return res
        .status(400)
        .json({ message: "A product must belong to the owner" });
    }

    const newProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
      },
    });
    res.status(201).json({
      message: "new updated product created successfully",
      data: newProduct,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productOwner = await Owner.findById(req.body.product);
    if (!productOwner) {
      return res
        .status(400)
        .json({ message: "A product must belong to the owner" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ message: "Product is exist " });
    }
    await Product.findByIdAndDelete(req.params.id);

    res.status(201).json({ message: "Product has been deleted !!" });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    const owner = await Owner.findById(req.body.id);
    if (!owner) {
      return res.status(400).json({ message: "Login first !! " });
    }
    const product = await Product.find();
    if (product.length > 0) {
      await Product.deleteMany();
      res.status(201).json({ message: "Products has been deleted !!" });
    } else {
      return res
        .status(404)
        .json({ message: "Products does not exist in the DB" });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    const owner = await Owner.findById(req.body.id);
    if (!(user || owner)) {
      return res.status(400).json({ message: "Login first !! " });
    }
    const product = await Product.find();
    if (product.length > 0) {
      return res.status(200).json(product);
    } else {
      return res
        .status(404)
        .json({ message: "Products does not exist in the DB" });
    }
  } catch (err) {
    console.log(err);
  }
};
