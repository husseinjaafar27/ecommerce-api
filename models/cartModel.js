const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    // product: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Product",
    //   },
    // ],
    // quantity: [
    //   {
    //     type: Number,
    //     default: "",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
