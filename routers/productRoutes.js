const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/newProduct", productController.createProduct);
router.put("/:id/updateProduct", productController.updateProduct);
router.delete("/:id/deleteProduct", productController.deleteProduct);
router.delete("/deleteAllProduct", productController.deleteAllProducts);
router.get("/getAllProduct", productController.getAllProducts);

module.exports = router;