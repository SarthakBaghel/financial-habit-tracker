import asyncHandler from "../utils/asyncHandler.js";
import Profile from "../models/Profile.js";

const allowedProfileFields = ["monthlyIncomeTarget", "savingsTarget", "riskPreference", "financialGoals"];

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = allowedProfileFields.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      payload[field] = req.body[field];
    }

    return payload;
  }, {});

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user._id },
    updates,
    {
      new: true,
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  res.status(200).json({ profile });
});
