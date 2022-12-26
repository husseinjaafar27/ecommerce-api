const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const ownerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your fullName"],
      trim: true,
      minLength: 5,
      maxLength: 35,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: 120,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please enter your password"],
      minLength: 8,
      maxLength: 20,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Hash Password
ownerSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
  } catch (err) {
    console.log(err);
  }
});

// Check password
ownerSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

ownerSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Check password changed after jwt token
ownerSchema.methods.passwordchanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangeTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangeTime > JWTTimestamp;
  }
  return false;
};

module.exports = mongoose.model("Owner", ownerSchema);
