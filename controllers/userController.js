const User = require("../models/userModel");
const validator = require("validator");
const crypto = require("crypto");
const sendMail = require("../utils/email").sendMail;

exports.signUp = async (req, res) => {
  try {
    let email = req.body.email;
    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "invalid email" });
    }
    // Check email
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      res.status(409).json({ message: "Email already in use" });
    }
    // Create new user
    const newUser = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", data: { newUser } });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    // Check email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({ message: "The user does not exist" });
    }
    // Check password
    if (!(await user.checkPassword(req.body.password, user.password))) {
      res.status(401).json({ message: "Incorrect email or password" });
    }
    return res
      .status(200)
      .json({ message: "You are logged in seccessfully !!" });
  } catch (err) {
    console.log(err);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "the user with the provided email does not exist." });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    user;
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${resetToken}`;

    const msg = `Forget your password? Reset it by visiting the following link: ${url}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Your password reset token: (valid for 10 min)",
        message: msg,
      });

      res.status(200).json({
        status: "success",
        message: "The reset link was delivered to your email seccessfully",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        message:
          "An error occured while sending the email, please try again in a moment",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "The token is invalid, or expired. please request a new one",
      });
    }

    if (req.body.password.length < 8) {
      return res.status(400).json({ message: "Password length is too short" });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
  }
};
