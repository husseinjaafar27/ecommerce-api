const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signupUser", userController.signUp);
router.post("/loginUser", userController.login);
router.post("/forgotPassword/user", userController.forgotPassword);
router.patch("/resetPassword/user/:token", userController.resetPassword);

module.exports = router;
