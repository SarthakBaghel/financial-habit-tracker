import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [80, "Name cannot exceed 80 characters."]
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."]
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required."],
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true
    },
    currencyPreference: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR"
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

export default User;
