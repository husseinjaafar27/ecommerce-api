const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/newOrder", orderController.newOrder);
router.patch("/:id/updateOrder", orderController.updateOrder);
router.delete("/deleteOrder", orderController.deleteOrder);


module.exports = router;
