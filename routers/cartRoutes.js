const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController1");

router.post("/newCart", cartController.newCart);
router.patch("/:id/updateCart", cartController.updateCart);
router.delete("/deleteCart", cartController.deleteCart);


module.exports = router;
