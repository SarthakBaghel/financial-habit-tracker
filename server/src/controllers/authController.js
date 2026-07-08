import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

const PASSWORD_MIN_LENGTH = 8;

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    currencyPreference: user.currencyPreference,
    createdAt: user.createdAt
  };
}

function sendAuthResponse(res, user, profile, statusCode = 200) {
  res.status(statusCode).json({
    token: generateToken(user),
    user: formatUser(user),
    profile
  });
}

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, currencyPreference = "INR" } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    res.status(400);
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
    currencyPreference
  });

  const profile = await Profile.create({ userId: user._id });

  sendAuthResponse(res, user, profile, 201);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const profile = await Profile.findOne({ userId: user._id });

  sendAuthResponse(res, user, profile);
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user._id });

  res.status(200).json({
    user: formatUser(req.user),
    profile
  });
});
