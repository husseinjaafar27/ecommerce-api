const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");

router.post("/signupOwner", ownerController.signUp);
router.post("/loginOwner", ownerController.protect,ownerController.login);
router.post("/forgotPassword", ownerController.forgotPassword);
router.patch("/resetPassword/:token", ownerController.resetPassword);

module.exports = router;
