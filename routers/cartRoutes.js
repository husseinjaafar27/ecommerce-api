const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/newCart", cartController.newCart);
router.delete("/deleteCart", cartController.deleteCart);
router.put("/:id/addRemoveOnCart", cartController.addRemoveOnCart);

module.exports = router;
