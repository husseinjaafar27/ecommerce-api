const Owner = require("../models/ownerModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../utils/email").sendMail;
const { promisify } = require("util");

exports.signUp = async (req, res) => {
  try {
    let email = req.body.email;
    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "invalid email" });
    }
    // Check email
    const checkEmail = await Owner.findOne({ email: email });
    if (checkEmail) {
      res.status(409).json({ message: "Email already in use" });
    }
    // Create new user
    const newOwner = await Owner.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });

    const msg = "Owner created successfully";
    createSendToken(newOwner, 201, res, msg);
    // return res
    //   .status(201)
    //   .json({ message: "Owner created successfully", data: { newOwner } });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    // Check email
    const user = await Owner.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({ message: "The user does not exist" });
    }
    // Check password
    if (!(await user.checkPassword(req.body.password, user.password))) {
      res.status(401).json({ message: "Incorrect email or password" });
    }
    const msg = "You are logged in seccessfully !!";
    createSendToken(user, 200, res, msg);
    // return res
    //   .status(200)
    //   .json({ message: "You are logged in seccessfully !!" });
  } catch (err) {
    console.log(err);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const owner = await Owner.findOne({ email: req.body.email });
    if (!owner) {
      return res
        .status(404)
        .json({ message: "the owner with the provided email does not exist." });
    }

    const resetToken = owner.generatePasswordResetToken();
    await owner.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${resetToken}`;

    const msg = `Forget your password? Reset it by visiting the following link: ${url}`;

    try {
      await sendMail({
        email: owner.email,
        subject: "Your password reset token: (valid for 10 min)",
        message: msg,
      });

      res.status(200).json({
        status: "success",
        message: "The reset link was delivered to your email seccessfully",
      });
    } catch (err) {
      owner.passwordResetToken = undefined;
      owner.passwordResetExpires = undefined;
      await owner.save({ validateBeforeSave: false });

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

    const owner = await Owner.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!owner) {
      return res.status(400).json({
        message: "The token is invalid, or expired. please request a new one",
      });
    }

    if (req.body.password.length < 8) {
      return res.status(400).json({ message: "Password length is too short" });
    }

    owner.password = req.body.password;
    owner.passwordResetToken = undefined;
    owner.passwordResetExpires = undefined;
    owner.passwordChangedAt = Date.now();

    await owner.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
  }
};

// JWT function
// incode
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, msg) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      message: msg,
      user,
    },
  });
};
//decode
exports.protect = async (req, res, next) => {
  try {
    //check token if exist
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not logged in. Please login to get access" });
    }
    // verify the token
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "jsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token, Login again" });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Your session token has expired !! Please login again",
        });
      }
    }
    // Check if owner token exist
    const currentOwner = await Owner.findById(decoded.id);
    if (!currentOwner) {
      return res.status(401).json({
        message: "The owner belong to this session does not longer exist ",
      });
    }
    // check password changed
    if (currentOwner.passwordChanged(decoded.iat)) {
      return res.status(401).json({
        message: "Your password has been changed!! Please login again",
      });
    }

    req.owner = currentOwner;
    next();
  } catch (err) {
    console.log(err);
  }
};
