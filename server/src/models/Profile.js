import mongoose from "mongoose";

const { Schema, model } = mongoose;

const financialGoalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    targetAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    deadline: {
      type: Date
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["planned", "active", "completed", "paused"],
      default: "planned"
    }
  },
  {
    _id: false
  }
);

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    monthlyIncomeTarget: {
      type: Number,
      min: 0,
      default: 0
    },
    savingsTarget: {
      type: Number,
      min: 0,
      default: 0
    },
    riskPreference: {
      type: String,
      enum: ["conservative", "moderate", "aggressive"],
      default: "moderate"
    },
    financialGoals: {
      type: [financialGoalSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Profile = model("Profile", profileSchema);

export default Profile;
