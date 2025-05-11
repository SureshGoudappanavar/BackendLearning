import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // ✅ Correct import

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  coverImage: { // ✅ Fixed typo
    type: String,
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // ✅ Recommended for security
  },
  refreshToken: {
    type: String,
    select: false, // ✅ Optional, for consistency
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Combine both tokens
userSchema.methods.generateAccessAndRefreshToken = function () {
  return {
    accessToken: this.generateAccessToken(),
    refreshToken: this.generateRefreshToken(),
  };
};

export const User = mongoose.model("User", userSchema);
