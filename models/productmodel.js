const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    image: {
      type: String,
      required: true,
    },
    categories: { type: Array },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      minlength: 0,
      maxLength: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
