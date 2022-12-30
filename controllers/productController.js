const Product = require("../models/productmodel");
const Owner = require("../models/ownerModel");

exports.createProduct = async (req, res) => {
  try {
    const productOwner = await Owner.findById(req.body.ownerID);
    if (!productOwner) {
      return res
        .status(400)
        .json({ message: "A product must belong to the owner" });
    }
    const currentOwner = productOwner.isAdmin;
    if (currentOwner !== true) {
      return res
        .status(400)
        .json({ message: "You must be admin to do this session" });
    }
    const { title, description, image, categories, price, rating } = req.body;
    const newProduct = new Product({
      title,
      description,
      image,
      categories,
      price,
      rating
    });
    await newProduct.save();
    // const newProduct = await Product.create({
    //   title: req.body.title,
    //   description: req.body.description,
    //   image: req.body.image,
    //   categories: req.body.categories,
    //   price: req.body.price,
    //   rating: req.body.rating,
    // });

    return res
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
    const currentOwner = productOwner.isAdmin;
    if (currentOwner !== true) {
      return res
        .status(400)
        .json({ message: "You must be admin to do this session" });
    }
    const newProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
      },
    });
    if (newProduct) {
      return res.status(201).json({
        message: "new updated product created successfully",
        data: newProduct,
      });
    }
    return res.status(400).json({ message: "product not found" });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productOwner = await Owner.findById(req.body.product);
    const currentOwner = productOwner.isAdmin;
    if (currentOwner !== true) {
      return res
        .status(400)
        .json({ message: "You must be admin to do this session" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ message: "Product is exist " });
    }
    await Product.findByIdAndDelete(req.params.id);

    return res.status(201).json({ message: "Product has been deleted !!" });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    const productOwner = await Owner.findById(req.body.id);
    if (!productOwner) {
      return res.status(400).json({ message: "Login first !! " });
    }
    const currentOwner = productOwner.isAdmin;
    if (currentOwner !== true) {
      return res
        .status(400)
        .json({ message: "You must be admin to do this session" });
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
    const productOwner = await Owner.findById(req.body.id);
    if (!productOwner) {
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
